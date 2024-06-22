import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreateDerbyForm from "./pages/CreateDerbyForm";
import Derbys from "./pages/Derbys";
import DetailsDerby from "./pages/DetailsDerby";

import Navbar from './layouts/Navbar';


function App() { 
  return (
    <div className="App bg-slate-100 min-h-full h-full">
      <Navbar />
      <Routes>       
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateDerbyForm />} />
          <Route path="/listDerbys" element={<Derbys />} />
          <Route path="/detailsDerby/:id" element={<DetailsDerby />} />
      </Routes>
    </div>
  );
}

export default App;
