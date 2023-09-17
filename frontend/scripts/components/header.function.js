import Logo from '/frontend/scripts/components/logo.function.js';

export default function Header() {
    return `
        <header class="box-section">
            ${Logo()}
        </header>
    `;
}