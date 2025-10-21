import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import Login from "./Login";
import { useNavigate } from "react-router-dom";
import Toast from "../components/common/Toast";

// Mocking the required hooks and components
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../components/common/Toast", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

// Mock localStorage
beforeAll(() => {
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.setItem = jest.fn();
});

describe("Login Component", () => {
  const navigate = jest.fn();

  beforeEach(() => {
    // Clear previous test runs
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(navigate);
  });

  test("renders the login form correctly", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("does not show success toast if not in location state", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    expect(screen.queryByText(/congratulations!/i)).not.toBeInTheDocument();
  });
});
