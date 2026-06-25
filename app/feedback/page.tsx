import FeedbackDashboard from "./FeedbackDashboard";

export default function FeedbackPage() {
  return <FeedbackDashboard feedbackAppUrl={process.env.FEEDBACK_APP_URL ?? ""} />;
}
