// Importing models
const Ticket = require("../database/model/ticket");
const Leads = require("../database/model/leads");
const Region = require("../database/model/region");
const Supervisor = require("../database/model/supervisor");
const SupportAgent = require("../database/model/supportAgent");
const User = require("../database/model/user");
const { Types } = require("mongoose");
const moment = require('moment-timezone');
const mongoose = require('mongoose');
const filterByRole = require("../services/filterByRole");
 
 
 
// Function to clean data
function cleanTicketData(data) {
  const cleanData = (value) => (value === null || value === undefined || value === 0 ? undefined : value);
  return Object.keys(data).reduce((acc, key) => {
    acc[key] = cleanData(data[key]);
    return acc;
  }, {});
}
 
// Function to generate the current date and time in a specified time zone
function generateOpeningDate(timeZone = "Asia/Kolkata", dateFormat = "YYYY-MM-DD", dateSplit = "-", timeFormat = "HH:mm:ss", timeSplit = ":") {
  const localDate = moment.tz(new Date(), timeZone);
  let formattedDate = localDate.format(dateFormat);
  if (dateSplit) {
    formattedDate = formattedDate.replace(/[-/]/g, dateSplit);
  }
  const formattedTime = localDate.format(timeFormat).replace(/:/g, timeSplit);
  const timeZoneName = localDate.format("z");
  const dateTime = `${formattedDate} ${formattedTime} (${timeZoneName})`;
 
  return {
    date: formattedDate,
    time: `${formattedTime} (${timeZoneName})`,
    dateTime,
  };
}
 
 
 
 
 
 
 
// Function to validate customer and support agent existence
const dataExist = async (customerId, supportAgentId) => {
  const [customerExists, supportAgentExists] = await Promise.all([
    Leads.find({ _id: customerId }, { _id: 1, firstName: 1 , image:1 }),
    SupportAgent.findOne({ _id: new Types.ObjectId(supportAgentId) }, { _id: 1, user: 1, region:1 }),
  ]);
 
  let supportAgentName = null;
  if (supportAgentExists && supportAgentExists.user) {
    const supportAgentUser = await User.findOne({ _id: supportAgentExists.user }, { userName: 1 });
    if (supportAgentUser) {
      supportAgentName = supportAgentUser.userName;
    }
  }
 
  return {
    customerExists,
    supportAgentExists: supportAgentExists || null,
    supportAgentName,
  };
};
 
 
 
 
exports.addTicket = async (req, res, next) => {
  try {
    const { id: userId, userName } = req.user;
    const cleanedData = cleanTicketData(req.body);
    const { customerId, priority, supportAgentId, ticketId } = cleanedData;
 
    // Validate required fields
    if (!customerId || !priority || !supportAgentId) {
      return res.status(400).json({ message: "Customer, priority, and support agent are required" });
    }
 
    // Check if customer and support agent exist
    const { customerExists, supportAgentExists } = await dataExist(customerId, supportAgentId);
    cleanedData.region = supportAgentExists.region;
 
    if (!customerExists) {
      return res.status(404).json({ message: "Customer not found" });
    }
    if (!supportAgentExists) {
      return res.status(404).json({ message: "Support Agent not found" });
    }
 
    // Fetch support agent details, including the region
    const supportAgent = await mongoose.model("SupportAgent").findById(supportAgentId).populate({
      path: "region",
      select: "_id name",
    });
 
    if (!supportAgent || !supportAgent.region) {
      return res.status(404).json({ message: "Region not found for the support agent" });
    }
 
    // Fetch supervisor based on the same region
    const supervisor = await mongoose.model("Supervisor").findOne({ region: supportAgent.region._id });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found in the same region" });
    }
 
    cleanedData.supervisor = supervisor._id;
 
    // Create the ticket using the createTicket function
    const savedTicket = await createTicket(cleanedData, customerId, supportAgentId, userId, userName);
 
    res.status(201).json({
      message: "Ticket added successfully",
      savedTicket: { ...savedTicket.toObject() },
    });
 
    ActivityLog(req, "successfully", savedTicket._id);
    next();
  } catch (error) {
    console.error("Error adding ticket:", error);
    res.status(500).json({ message: "Internal server error" });
    ActivityLog(req, "Failed");
    next();
  }
};
 

exports.unassignedTickets = async (req, res, next) => {
  try {
    const { requester, subject, description } = req.body;

    // Validate required fields
    if (!requester || !subject || !description) {
      return res.status(400).json({ message: "Requester, subject, and description are required" });
    }

    // Find customer (Lead) by email
    const lead = await Leads.findOne({ email: requester });
    if (!lead) {
      return res.status(404).json({ message: "Requester not found in Leads" });
    }
    
    const { _id: customerId, regionId: regionId } = lead;


    // Find supervisor by region
    const supervisor = await Supervisor.findOne({ region: regionId });
    if (!supervisor) {
      return res.status(404).json({ message: "Supervisor not found for the requester's region" });
    }

    // Generate next ticket ID
    let nextId = 1;
    const lastTicket = await Ticket.findOne().sort({ ticketId: -1 });
    if (lastTicket && lastTicket.ticketId) {
      const splitId = lastTicket.ticketId.split("-");
      if (splitId.length > 1) {
        nextId = parseInt(splitId[1]) + 1;
      }
    }

    // Create new ticket
    const newTicket = new Ticket({
      ticketId: `TK-${nextId}`,
      customerId,
      region: regionId,
      supervisor: supervisor._id,
      subject,
      description,
      status: "Open",
      openingDate: generateOpeningDate().dateTime,
    });

    const savedTicket = await newTicket.save();

    res.status(201).json({
      message: "Your ticket has been created successfully!",
      ticketId:savedTicket._id
    });
    
    next();
  } catch (error) {
    console.error("Error creating unassigned ticket:", error);
    res.status(500).json({ message: "Internal server error" });
    next();
  }
};
 
 
 
exports.getTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findById(ticketId)
      .populate({
        path: 'customerId',
        select: 'firstName image organizationName email phone',
      })
      .populate({
        path: 'region',
        model: 'Region',
        select: 'regionName',
      })
      .populate({
        path: 'supportAgentId',
        select: 'user',
        populate: {
          path: 'user',
          select: 'userName userImage',
        },
      });
 
    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }
 
    res.status(200).json(ticket);
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
 
 
exports.getAllTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = await filterByRole(userId);

    const tickets = await Ticket.find(query)
      .populate({
        path: 'customerId',
        select: 'firstName image',
      })
      .populate({
        path: 'region',
        model: 'Region',
        select: 'regionName',
      })
      .populate({
        path: 'supportAgentId',
        select: 'user',
        populate: {
          path: 'user',
          select: 'userName userImage',
        },
      });

    if (!tickets) {
      return res.status(404).json({ message: 'Tickets not found' });
    }

    const totalTickets = tickets.length;

    // Calculate unresolved tickets (status != 'Resolved')
    const unresolvedTickets = tickets.filter(ticket => ticket.status !== 'Resolved').length;

    // Calculate solved tickets (totalTickets - unresolvedTickets)
    const solvedTickets = totalTickets - unresolvedTickets;

    // Calculate unassigned tickets (supportAgentId === null)
    const unassignedTickets = tickets.filter(ticket => !ticket.supportAgentId).length;

    res.status(200).json({
      tickets,
      totalTickets,
      unresolvedTickets,
      solvedTickets,
      unassignedTickets,
    });
  } catch (error) {
    console.error("Error fetching all tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getAllUnassignedTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const query = await filterByRole(userId);

    // Add condition to filter unassigned tickets
    query.supportAgentId = null;

    const tickets = await Ticket.find(query)
      .populate({
        path: 'customerId',
        select: 'firstName image',
      })
      .populate({
        path: 'region',
        model: 'Region',
        select: 'regionName',
      })
      .populate({
        path: 'supervisor',
        select: 'name email',
      });

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: 'No unassigned tickets found' });
    }

    const totalTickets = tickets.length;
    res.status(200).json({ tickets, totalTickets });
  } catch (error) {
    console.error("Error fetching unassigned tickets:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

 
 
 
 
 
exports.getCustomers = async (req, res) => {
  try {
    // Fetch customers with customerStatus "Trial" or "Licenser"
    const customers = await Leads.find({
      customerStatus: { $in: ["Trial", "Licenser"] },
    });
 
    if (!customers || customers.length === 0) {
      return res
        .status(404)
        .json({ message: "No customers found with Trial or Licenser status" });
    }
 
    // Respond with the list of customers
    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 
 
 
exports.updateTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const updateFields = { ...req.body };
 
    // Check if the status is being updated to 'Resolved'
    if (updateFields.status === 'Resolved') {
      const ticket = await Ticket.findById(ticketId);
      const openingDate = new Date(ticket.openingDate);  // Assuming openingDate is a string, convert it to Date object
 
      const currentDate = new Date();
      const resolutionTime = Math.abs(currentDate - openingDate); // Time difference in milliseconds
 
      // Convert milliseconds to a human-readable format (e.g., hours and minutes)
      const hours = Math.floor(resolutionTime / (1000 * 60 * 60));
      const minutes = Math.floor((resolutionTime % (1000 * 60 * 60)) / (1000 * 60));
 
      updateFields.resolutionTime = `${hours} hours ${minutes} minutes`;
    }
 
    // Update the ticket in the database
    const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, updateFields, { new: true });
 
    ActivityLog(req, "Successfully updated ticket", updatedTicket?._id);
    next();
 
    return res.status(200).json({
      message: "Ticket updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    ActivityLog(req, "Failed to update ticket");
    next();
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
 
 
 
exports.deleteTicket = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(ticketId);
 
    if (!deletedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
 
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
 
 
 
 
const ActivityLog = (req, status, operationId = null) => {
  const { id, userName } = req.user;
  const log = { id, userName, status };
 
  if (operationId) {
    log.operationId = operationId;
  }
 
  req.user = log;
};
 
 
 
 
async function createTicket(cleanedData, customerId, supportAgentId, userId, userName) {
  const { ...rest } = cleanedData;
 
  // Generate next ticket ID
  let nextId = 1;
  const lastTicket = await Ticket.findOne().sort({ ticketId: -1 });
 
  if (lastTicket && lastTicket.ticketId) {
    const splitId = lastTicket.ticketId.split("-");
    if (splitId.length > 1) {
      nextId = parseInt(splitId[1]) + 1;
    }
  }
 
  const newTicket = new Ticket({
    ...rest,
    ticketId: `TK-${nextId}`,
    openedBy: userId,
    openedByName: userName,
    openingDate: generateOpeningDate().dateTime,
    status:"Open",
    customerId,
    supportAgentId,
  });
 
  return newTicket.save();
}