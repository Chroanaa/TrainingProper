import React from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Auth/AuthProvider";
import { auth } from "../../firebase/Auth/auth";
import Loading from "../components/ui/Loading";
function LoginPage() {
  const { login, authToken } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState({
    username: "",
    password: "",
  });
  React.useEffect(() => {
    if (authToken) {
      navigate("/", { replace: true });
    }
  }, [authToken]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await auth(inputValue.username, inputValue.password);
      login(user);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            id='username'
            name='username'
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <input
            type='password'
            id='password'
            name='password'
            onChange={handleInputChange}
            required
          />
        </div>
        <button type='submit'>Login</button>
      </form>
      {loading && <Loading text='Loading...' show={loading} />}
    </div>
  );
}

export default LoginPage;
