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
  gap: 4px; /* Equivalent to gap-1 */
  transition: opacity 0.3s, background-color 0.3s;
  z-index: 100000; /* Always on top */
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    opacity: ${(props) => (props.disabled ? 1 : 0.9)};
  }
`;

export default function Button({ icon, children, onClick, className, disabled }) {
  return (
    <StyledButton disabled={disabled} className={className} onClick={disabled ? null : onClick}>
      {icon}
      {children}
    </StyledButton>
  );
}
