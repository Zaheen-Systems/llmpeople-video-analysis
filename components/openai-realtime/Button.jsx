import styled from "styled-components";

const StyledButton = styled.button`
  background-color: ${(props) =>
    props.disabled
      ? "rgb(156, 163, 175)"
      : "rgb(9, 88, 199)"}; /* Grey when disabled, else bg-gray-800 */
  color: white;
  border-radius: 9999px; /* Equivalent to rounded-full */
  padding: 16px; /* Equivalent to p-4 */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px; /* Equivalent to gap-1 */
  transition: opacity 0.3s, background-color 0.3s;
  z-index: 100000; /* Always on top */
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  min-width: 200px; /* Set minimum width for consistency */
  width: ${(props) => (props.fullWidth ? "100%" : "auto")};

  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }
`;

export default function Button({ icon, children, onClick, className, disabled, fullWidth }) {
  return (
    <StyledButton
      disabled={disabled}
      className={className}
      onClick={disabled ? null : onClick}
      fullWidth={fullWidth}
    >
      {icon}
      {children}
    </StyledButton>
  );
}
