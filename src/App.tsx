import { BrowserRouter, Route, Routes } from "react-router-dom";
import Addrecipient from "./Addrecipient";
import HomePage from "./HomePage";
import WebWorkersPage from "./WebWorkersPage";
import BulkInfoSearch from "./BulkInfoSearch";
import RNDWorldPage from "./Mainheader";
import DebounceSearch from "./DebounceSearch";
import BulkSearchWebWorkers from "./BulkSearchWebWorkers";
import MultipartUpload from "./MultipartUpload";
import MultipartUploadPage from "./MultipartUpload";
import MultipartUploadAndView from "./MultipartUploadAndView";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/rnd" element={<RNDWorldPage />} />
        <Route path="/web-workers" element={<WebWorkersPage />} />
        <Route path="/Addrecipient" element={<Addrecipient />} />
        <Route path="/bulkinfosearch" element={<BulkInfoSearch />} />
        <Route path="/debounce-search" element={<DebounceSearch />} />
        <Route
          path="/bulk-search-web-workers"
          element={<BulkSearchWebWorkers />}
        />
        <Route path="/multipart-upload" element={<MultipartUploadAndView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
