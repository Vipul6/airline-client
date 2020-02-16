import React from "react";
import ReactDOM from "react-dom";
import Snackbar from "../components/Snackbar";
import { render, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Snackbar />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it("renders snackbar correctly with correct message", () => {
  const { getByTestId } = render(<Snackbar message="App running fine" />);
  expect(getByTestId("alert-message")).toHaveTextContent("App running fine");
});

it("renders snackbar correctly with correct message", () => {
  const { getByTestId } = render(<Snackbar message="Another message" />);
  expect(getByTestId("alert-message")).toHaveTextContent("Another message");
});

it("renders snackbar correctly with success type class name", () => {
  const { getByTestId } = render(
    <Snackbar message="Success message" alertType="success" />
  );
  expect(
    getByTestId("alert-message").parentNode.classList.contains("type-success")
  ).toBe(true);
});

it("renders snackbar correctly with failure type class name", () => {
  const { getByTestId } = render(
    <Snackbar message="Success message" alertType="failure" />
  );
  expect(
    getByTestId("alert-message").parentNode.classList.contains("type-failure")
  ).toBe(true);
});
