import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

type Props = {
    value: string | undefined
    onChange: (value: string | undefined) => void
}

export default function PhoneInputComponent({ value, onChange }: Props) {
    return (
        <div>
            <PhoneInput
                country={'us'}
                value={value}
                onChange={phone => onChange(phone)}
                inputStyle={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: "#1e293b",
                    border: '1px solid #475569',
                    color: '#fff'
                }}
                containerStyle={{
                    backgroundColor: "#1e293b",
                    border: '1px solid #475569',
                    color: '#000000',
                    borderRadius: '0.375rem',
                }}
            />
        </div>
    )
}
