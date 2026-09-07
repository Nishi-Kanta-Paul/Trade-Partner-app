import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "@/screens/Home";
import ProposalForm from "@/screens/ProposalForm";
import ArrivalForm from "@/screens/ArrivalForm";
import DepartureForm from "@/screens/DepartureForm";
import RecapForm from "@/screens/RecapForm";
import InvoiceForm from "@/screens/InvoiceForm";
import VideoScreen from "@/screens/VideoScreen";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/proposal" element={<ProposalForm />} />
        <Route path="/arrival" element={<ArrivalForm />} />
        <Route path="/departure" element={<DepartureForm />} />
        <Route path="/recap" element={<RecapForm />} />
        <Route path="/invoice" element={<InvoiceForm />} />
        <Route path="/video/:videoId" element={<VideoScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
