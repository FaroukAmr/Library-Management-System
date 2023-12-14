import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  navigate('/books');
  return <div></div>;
};

export default Home;
