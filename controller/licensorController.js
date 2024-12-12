const Leads = require("../database/model/leads")
const Region = require('../database/model/region')
const Area = require('../database/model/area')
const mongoose = require('mongoose');
const Bda = require('../database/model/bda')
const User = require("../database/model/user");


// Fetch existing data
const dataExist = async ( regionId, areaId , bdaId ) => {  
  const [regionExists, areaExists , bdaExists  ] = await Promise.all([
    Region.findOne({ _id:regionId }, { _id: 1, regionName: 1 }),
    Area.findOne({ _id:areaId}, { _id: 1, areaName: 1 }),
    Bda.findOne({ _id:bdaId},{ _id: 1 , user : 1})
  ]);    

  
  
return { 
   regionExists,
  areaExists,
  bdaExists,
};
};




exports.addLicenser = async (req, res , next ) => {
  try {
    const { id: userId, userName } = req.user;

    const cleanedData = cleanLicenserData(req.body);

    const { email, regionId, areaId , bdaId } = cleanedData;



    // Check if a lead with the same email already exists
    const existingLicenser = await Leads.findOne({ email });
    if (existingLicenser) {
      return res.status(400).json({ message: "A Licensor with this email already exists" });
    }

    const { regionExists, areaExists , bdaExists } = await dataExist( regionId, areaId , bdaId);

    if (!validateRegionAndArea( regionExists, areaExists, bdaExists ,res )) return;

    if (!validateInputs( cleanedData, regionExists, areaExists, bdaExists ,res)) return;
  
    // const newLead = await createLead(cleanedData)


    
    const savedLicenser = await createLicenser(cleanedData, regionId, areaId, bdaId ,  userId, userName );

    res.status(201).json({ message: "licenser added successfully", savedLicenser });

  // Pass operation details to middleware
  ActivityLog(req, "successfully", savedLicenser._id);
  next();

  } catch (error) {
    console.error("Error adding licenser:", error);
    res.status(500).json({ message: "Internal server error" });
    ActivityLog(req, "Failed");
    next();
  }
};


// Updated Get Lead Function
exports.getLicenser = async (req, res) => {
  try {
    const { licenserId } = req.params;

    // Fetch the lead by ID
    const licenser = await Leads.findById(licenserId);
    if (!licenser) {
      return res.status(404).json({ message: "licenser not found" });
    }

    
    const { regionId, areaId, bdaId } = licenser;

    // Validate related entities using dataExist
    const { regionExists, areaExists, bdaExists } = await dataExist(regionId, areaId, bdaId);


     console.log("RegionExists:", regionId);
  console.log("cAreaExists:", areaId);
  console.log("BdaExists:", bdaId);

    // Enrich the response with related data
    const enrichedLicenser = {
      ...licenser.toObject(),
      validationErrors: {
        region: !regionExists ? "Invalid regionId" : undefined,
        area: !areaExists ? "Invalid areaId" : undefined,
        bda: !bdaExists ? "Invalid bdaId" : undefined,
      },
      regionDetails: regionExists, // Already an object
      areaDetails: areaExists,    // Already an object
      bdaDetails: bdaExists,      // Already an object
    };

    res.status(200).json(enrichedLicenser);
  } catch (error) {
    console.error("Error fetching licenser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Get All Leads
exports.getAllLicesner = async (req, res) => {
  try {
    // Fetch all leads from the database
    const licensers = await Leads.find();

    // Check if leads exist
    if (!licensers || licensers.length === 0) {
      return res.status(404).json({ message: "No Licenser found." });
    }

    // Validate and enrich data for each lead
    const enrichedlicenser = await Promise.all(
        licensers.map(async (licenser) => {
        const { regionId, areaId, bdaId } = licenser;

        // Use dataExist to validate and fetch related details
        const { regionExists, areaExists, bdaExists } = await dataExist(regionId, areaId, bdaId);

        // Validate related entities
        if (!regionExists || !areaExists || !bdaExists) {
          return {
            ...licenser.toObject(),
            validationErrors: {
              region: !regionExists ? "Invalid regionId" : undefined,
              area: !areaExists ? "Invalid areaId" : undefined,
              bda: !bdaExists ? "Invalid bdaId" : undefined,
            },
          };
        }

        // Include validated data
        return {
          ...licenser.toObject(),
          regionDetails: regionExists[0], // Assuming regionExists is an array
          areaDetails: areaExists[0],    // Assuming areaExists is an array
          bdaDetails: bdaExists[0],      // Assuming bdaExists is an array
        };
      })
    );

    // Respond with the enriched leads data
    res.status(200).json({ licensers: enrichedlicenser });
  } catch (error) {
    console.error("Error fetching licenser:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};





exports.editLicenser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = cleanLicenserData(req.body);

    // Fetch the existing document to get the user field
const existingLicenser = await Leads.findById(id);
if (!existingLicenser) {
  return res.status(404).json({ message: "licenser  not found" });
}

// Extract the user field (ObjectId)
const existingUserId = existingLicenser.user;



    // Check for duplicate user details, excluding the current document
    const duplicateCheck = await checkDuplicateUser(data.firstName, data.email, data.phone, existingUserId);
    if (duplicateCheck) {
      return res.status(400).json({ message: `Conflict: ${duplicateCheck}` });
    }

   
    Object.assign(existingLicenser, data);
    const updatedLicenser = await existingLicenser.save();

    if (!updatedLicenser) {
      return res.status(404).json({ message: "licenser not found" });
    }

    res.status(200).json({
      message: "Licenser updated successfully"
    });
    ActivityLog(req, "Successfully", updatedLicenser._id);
    next()
  } catch (error) {
    console.error("Error editing licenser:", error);
    res.status(500).json({ message: "Internal server error" });
    ActivityLog(req, "Failed");
   next();
  }
};



// exports.deleteLead = async (req, res, next) => {
//   try {
//     const { leadId } = req.params;

//     // Delete the lead
//     const deletedLead = await Leads.findByIdAndDelete(leadId);

//     if (!deletedLead) {
//       return res.status(404).json({ message: "Lead not found" });
//     }

//     res.status(200).json({ message: "Lead deleted successfully" });

//     // Pass operation details to middleware
//     ActivityLog(req, "successfully");
//     next();
//   } catch (error) {
//     console.error("Error deleting lead:", error);
//     res.status(500).json({ message: "Internal server error" });

//     // Log the failure
//     ActivityLog(req, "Failed");
//     next();
//   }
// };

async function createLicenser(cleanedData, regionId, areaId, bdaId, userId, userName) {
    const { ...rest } = cleanedData;
  
    // Generate the next licenser ID
    let nextId = 1;
  
    // Fetch the last licenser based on the numeric part of licenserId
    const lastLicenser = await Leads.findOne({ licenserId: { $exists: true } })
      .sort({ $natural: -1 }); // Sort by insertion order or creation time
  
    if (lastLicenser && lastLicenser.licenserId) {
      // Extract numeric part and calculate next ID
      const lastId = parseInt(lastLicenser.licenserId.split("-")[1], 10) || 0;
      nextId = lastId + 1;
    }
  
    // Format the new licenser ID
    const licenserId = `LICENSER-${nextId.toString().padStart(4, "0")}`;
  
    // Save the new licenser
    const savedLicenser = await createNewLicenser(
      { ...rest, licenserId },
      regionId,
      areaId,
      bdaId,
      true,
      userId,
      userName
    );
  
    return savedLicenser;
  }
  

const ActivityLog = (req, status, operationId = null) => {
  const { id, userName } = req.user;
  const log = { id, userName, status };

  if (operationId) {
    log.operationId = operationId;
  }

  req.user = log;
};




  // Validate Organization Tax Currency
  function validateRegionAndArea( regionExists, areaExists, bdaExists ,res ) {
    if (!regionExists) {
      res.status(404).json({ message: "Region not found" });
      return false;
    }
    if (!areaExists) {
      res.status(404).json({ message: "Area not found." });
      return false;
    }
    if (!bdaExists) {
      res.status(404).json({ message: "BDA not found." });
      return false;
    }
    return true;
  }



  const checkDuplicateUser = async (firstName, email, phone, excludeId) => {
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: excludeId } }, // Exclude the current document
        {
          $or: [
            { firstName },
            { email },
            { phone },
          ],
        },
      ],
    });
  


    if (!existingUser) return null;
  
    const duplicateMessages = [];
    if (existingUser.firstName === userName)
      duplicateMessages.push("Full name already exists");
    if (existingUser.email === email)
      duplicateMessages.push("Login email already exists");
    if (existingUser.phone === phone)
      duplicateMessages.push("Phone number already exists");
  
    return duplicateMessages.join(". ");
  };
  


   //Clean Data 
   function cleanLicenserData(data) {
    const cleanData = (value) => (value === null || value === undefined || value === "" ? undefined : value);
    return Object.keys(data).reduce((acc, key) => {
      acc[key] = cleanData(data[key]);
      return acc;
    }, {});
  }
  


  // Create New Debit Note
  function createNewLicenser(data, regionId, areaId, bdaId, newLicenser, userId, userName) {
    const newLicensers = new Leads({ ...data, regionId, areaId, bdaId, newLicenser, userId, userName });
    return newLicensers.save();
  }
  


   //Validate inputs
   function validateInputs( data, regionExists, areaExists, bdaExists, res) {
    const validationErrors = validateLicenserData(data, regionExists, areaExists, bdaExists );  
  
    if (validationErrors.length > 0) {
      res.status(400).json({ message: validationErrors.join(", ") });
      return false;
    }
    return true;
  }
  
  
  
  //Validate Data
  function validateLicenserData( data  ) {
    const errors = [];
  
    //Basic Info
    validateReqFields( data, errors );
    validateSalutation(data.salutation, errors);
    validateLicenserStatus(data.licenserStatus, errors);
  
  
    return errors;
  }
  
  
  
  // Field validation utility
  function validateField(condition, errorMsg, errors) {
    if (condition) errors.push(errorMsg);
  }
  
  //Validate Salutation
  function validateSalutation(salutation, errors) {
    validateField(salutation && !validSalutations.includes(salutation),
      "Invalid Salutation: " + salutation, errors);
  }
  
  //Validate Salutation
  function validateLicenserStatus(licenserStatus, errors) {
    validateField(licenserStatus && !validLicenserStatus.includes(licenserStatus),
      "Invalid leadStatus: " + licenserStatus, errors);
  }


  //Valid Req Fields
  function validateReqFields( data, errors ) {
  
  validateField( typeof data.regionId === 'undefined' , "Please select a Region", errors  );
  validateField( typeof data.areaId === 'undefined','undefined', "Please select a Area", errors  );
  validateField( typeof data.bdaId === 'undefined', "Please select a BDA", errors  );
  validateField( typeof data.firstName === 'undefined', "Firstname required", errors  );
  validateField( typeof data.email === 'undefined', "email required", errors  );
  validateField( typeof data.phone === 'undefined', "Phone number required", errors  );
  validateField( typeof data.startDate === 'undefined', "Start Date required", errors  );
  validateField( typeof data.endDate === 'undefined', "End Date required", errors  );

  }
  
  
  
  const validSalutations = ["Mr.", "Mrs.", "Ms.", "Miss.", "Dr."];
  const validLicenserStatus = ["New", "Contacted", "Inprogress", "Lost", "Won"];
  
  
 