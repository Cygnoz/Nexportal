// v1.0
const User = require('../../database/model/user');
const ActivityLog = require('../../database/model/activityLog');
const moment = require("moment-timezone");

const ActivityLogGeneration = (...role) => {
    return async (req, res, next) => {
      try {
        const user = await User.findById(req.user.id);
        // if (!user) {
        //   return res.status(401).json({ message: 'User not found' });
        // }
        const Status = req.user.status
        const permissionAction = role[role.length - 1];
        const Screen = permissionAction.split(' ')[1]
        const Action = permissionAction.split(' ')[0]
        
        
  
         const generatedDateTime = generateTimeAndDateForDB(
          "Asia/Kolkata",
          "DD/MM/YY",
          "/"
        );
        const actionTime = generatedDateTime.dateTime;

        const activity = new ActivityLog({
            userId: req.user.id, // Assuming your User model has a username field
            operationId : req.user.operationId,
            activity: `${req.user.userName} ${Status} ${permissionAction}.`, // Log the note associated with the permission
            timestamp: actionTime,
            action: Action,
            status: Status,
            screen:Screen
          });
          await activity.save();

        
       
      } catch (err) {
        console.error('Error in checkPermission:', err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    };
  };

  function generateTimeAndDateForDB(
    timeZone,
    dateFormat,
    dateSplit,
    baseTime = new Date(),
    timeFormat = "HH:mm:ss",
    timeSplit = ":"
  ) {
    // Convert the base time to the desired time zone
    const localDate = moment.tz(baseTime, timeZone);
  
    // Format date and time according to the specified formats
    let formattedDate = localDate.format(dateFormat);
  
    // Handle date split if specified
    if (dateSplit) {
      // Replace default split characters with specified split characters
      formattedDate = formattedDate.replace(/[-/]/g, dateSplit); // Adjust regex based on your date format separators
    }
  
    const formattedTime = localDate.format(timeFormat);
    const timeZoneName = localDate.format("z"); // Get time zone abbreviation
  
    // Combine the formatted date and time with the split characters and time zone
    const dateTime = `${formattedDate} ${formattedTime
      .split(":")
      .join(timeSplit)} (${timeZoneName})`;
  
    return {
      date: formattedDate,
      time: `${formattedTime} (${timeZoneName})`,
      dateTime: dateTime,
    };
  }
  
  module.exports = ActivityLogGeneration