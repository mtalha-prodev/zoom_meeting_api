import express from "express";
import {
  createMeeting,
  getByIdMeeting,
  getMeeting,
  pastMeetingById,
  updateMeeting,
  zoomAuth,
  zoomRedirect,
} from "../controller/auth/auth.js";

const router = express.Router();

router.get("/authorize", zoomAuth);
router.get("/redirect", zoomRedirect);
router.get("/meetings", getMeeting);
router.post("/meetings", createMeeting);
router.patch("/meetings/:meetingId", updateMeeting);
router.get("/meetings/:meetingId", getByIdMeeting);
router.get("/past_meetings/:id", pastMeetingById);

export default router;
