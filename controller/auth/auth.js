import axios from "axios";

// first authorization request
export const zoomAuth = async (req, res) => {
  try {
    const clientId = process.env.CLIENT_ID;
    // redirect to get token
    const redirect = process.env.REDIRECT_URL;

    const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirect}`;

    return res.redirect(encodeURI(url));
  } catch (error) {
    return res.json({ status: false, error: error });
  }
};

// redirect to the get access_token
export const zoomRedirect = async (req, res) => {
  let code = req.query.code;
  // console.log(code);
  try {
    // post data to get access_token
    const result = await axios.post(`https://zoom.us/oauth/token`, null, {
      params: {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URL,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });
    // console.log(result.data);

    const token = result.data.access_token;
    // set env access token only test prps production stora in db/send frontend
    process.env.access_token = token;

    return res.json(token);
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};

// get list of meetings
export const getMeeting = async (req, res) => {
  try {
    // const token = sessionStorage.getItem("access_token");
    // pass query to filter meetings
    let { type, next_page_token, page_number } = req.query;

    type = !type ? "scheduled" : type;
    next_page_token = !next_page_token ? "" : next_page_token;
    page_number = !page_number ? 1 : page_number;

    // const url = `https://api.zoom.us/v2/users/me/meetings`
    const url = `https://api.zoom.us/v2/users/me/meetings?type=${type}&page_size=300&next_page_token=${next_page_token}&page_number=${page_number}`;

    // post data to get access_token
    const result = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.access_token}`,
        "Content-Type": "application/json",
      },
    });

    // filter meeting list

    // console.log(result.data);

    return res.json(result.data);
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};

//  create zoom meeting
export const createMeeting = async (req, res) => {
  try {
    //  topic="SoftMind testing meeting"
    //  start_time="2023-11-25T10:00:00"
    //  type=2
    //  duration=60
    //  timezone="UTC"
    //  agenda="Team meeting for future videos"

    let { topic, start_time, type, duration, timezone, agenda } = req.body;

    const { data } = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic,
        type,
        start_time,
        duration,
        timezone,
        agenda,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          watermark: false,
          use_pmi: false,
          approval_type: 0,
          audio: "both",
          auto_recording: "none",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ status: true, data });
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};

// update zoom meeting
export const updateMeeting = async (req, res) => {
  try {
    //  topic="SoftMind testing meeting"
    //  start_time="2023-11-25T10:00:00"
    //  type=2
    //  duration=60
    //  timezone="UTC"
    //  agenda="Team meeting for future videos"

    let { topic, start_time, type, duration, timezone, agenda } = req.body;
    const { meetingId } = req.params;

    const data = await axios.patch(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ status: true, data });
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};

// get by id zoom meeting
export const getByIdMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const { data } = await axios.get(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({ status: true, data });
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};

// get by id past zoom meeting by id uuid encodeURI
export const pastMeetingById = async (req, res) => {
  try {
    let { uuid } = req.query;
    let { id } = req.params;

    let meetingId = uuid ? uuid : id;

    console.log(meetingId);

    const uri = `https://api.zoom.us/v2/past_meetings/${encodeURI(meetingId)}`;

    const { data } = await axios.get(uri, {
      headers: {
        Authorization: `Bearer ${process.env.access_token}`,
        "Content-Type": "application/json",
      },
    });

    return res.json({ status: true, data });
  } catch (error) {
    return res.json({ status: false, error: error.message });
  }
};
