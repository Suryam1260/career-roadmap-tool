import { apiRequest } from "./api";

export const sendLSQActivity = async ({ activityName, fields = [], account = 'academy' }) => {
  try {
    await apiRequest(
      'POST',
      '/api/lsq-events/send-activity',
      {
        activity_name: activityName,
        account_name: account,
        fields
      }
    );
  } catch (error) {
    console.error("Error sending LSQ activity:", error);
  }
};


