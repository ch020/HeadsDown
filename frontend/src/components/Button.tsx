import { ButtonHTMLAttributes } from "react";

export default function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    const {className = '', ...rest} = props
    return (
        <button
            {...rest}
            className={`px-4 py-2 rounded-2xl font-semibold bg-brand-600 hover:bg-brand-700 active:scale-95 transition ${className}`}
        />
    )
}