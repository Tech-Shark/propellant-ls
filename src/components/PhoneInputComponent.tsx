import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./phone-input.css"; // We'll create this CSS file for custom styling

type Props = {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export default function PhoneInputComponent({ value, onChange }: Props) {
  return (
    <div className="phone-input-wrapper">
      <PhoneInput
        country={"us"}
        value={value}
        onChange={(phone) => onChange(phone)}
        inputStyle={{
          width: "100%",
          height: "40px",
          backgroundColor: "#1e293b",
          border: "1px solid #475569",
          color: "#fff",
          fontSize: "16px", // Larger font size for mobile
          paddingTop: "8px",
          paddingBottom: "8px",
          paddingLeft: "48px", // Space for the country code
        }}
        containerStyle={{
          width: "100%", // Ensure full width
          backgroundColor: "#1e293b",
          border: "1px solid #475569",
          color: "#000000",
          borderRadius: "0.375rem",
        }}
        buttonStyle={{
          backgroundColor: "#1e293b",
          borderColor: "#475569",
          borderRight: "1px solid #475569",
        }}
        dropdownStyle={{
          backgroundColor: "#1e293b",
          color: "#fff",
          width: "300px", // Wider dropdown for mobile
        }}
      />
    </div>
  );
}
