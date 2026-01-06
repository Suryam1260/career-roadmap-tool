import { apiRequest } from "./api";
import { generateJWT } from "./api";

export const sendLSQActivity = async ({ activityName, fields = [], account = 'academy' }) => {
  try {
    const token = await generateJWT();
    await apiRequest(
      'POST',
      '/api/v3/lsq-events/send-activity/',
      {
        activity_name: activityName,
        account_name: account,
        fields
      },
      {
        headers: {
          'X-User-Token': token,
        }
      }
    );
  } catch (error) {
    // no-op
  }
};


