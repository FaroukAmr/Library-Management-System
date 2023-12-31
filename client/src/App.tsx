import './styles/shared.css';

import { Route, Routes } from 'react-router-dom';

import { BookDetails } from './views/BookDetails';
import Books from './views/Books';
import { BorrowedBooksDetails } from './views/BorrowedBookDetails';
import CreateBook from './views/CreateBook';
import Login from './views/Login';
import MyBooks from './views/MyBooks';
import Navbar from './views/Navbar';
import PrivateRoutes from './views/PrivateRoutes';
import SignUp from './views/SignUp';

const App = () => {
  return (
    <div className="main">
      <Navbar />
      <Routes>
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/" element={<MyBooks />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/create" element={<CreateBook />} />
          <Route path="books/:id" element={<BookDetails />} />
          <Route path="/my-books" element={<MyBooks />} />
          <Route path="/my-books/:id" element={<BorrowedBooksDetails />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
