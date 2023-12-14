import { Route, Routes } from 'react-router-dom';

import Books from './views/Books';
import CreateBooks from './views/CreateBooks';
import Home from './views/home';
import Login from './views/Login';
import PrivateRoutes from './views/PrivateRoutes';
import SignUp from './views/SignUp';

const App = () => {
  return (
    <Routes>
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/" element={<Home />} />
        <Route path="/books/create" element={<CreateBooks />} />
        <Route path="/books" element={<Books />} />
      </Route>
    </Routes>
  );
};

export default App;
