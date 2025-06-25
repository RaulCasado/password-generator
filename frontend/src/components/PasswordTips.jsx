import { useRef, useState, useEffect } from "react";
import "./password-tips.css";

const tips = [
    {
        title: "💡 ¿Por qué usar contraseñas largas?",
        heading: "Contraseñas largas = Más seguridad",
        text: "Una contraseña de 12 o más caracteres es exponencialmente más difícil de descifrar que una corta. ¡Combina palabras aleatorias para que sea fuerte y fácil de recordar!",
    },
    {
        title: "🔒 ¿Por qué usar contraseñas únicas?",
        heading: "Contraseñas únicas = Más seguridad",
        text: "Usar la misma contraseña en múltiples sitios es arriesgado. Si un sitio recibe un ataque, todas tus cuentas están en peligro. ¡Usa una contraseña única para cada cuenta!",
    },
    {
        title: "🔑 ¿Por qué usar autenticación de dos factores?",
        heading: "Autenticación de dos factores = Más seguridad",
        text: "La autenticación de dos factores añade una capa extra de seguridad. Incluso si alguien obtiene tu contraseña, necesitará un segundo factor para acceder a tu cuenta.",
    },
    {
        title: "🎣 ¿Qué es el phishing?",
        heading: "Phishing = Riesgo de seguridad",
        text: "El phishing es un intento de engañarte para que reveles información personal. Siempre verifica la URL y no hagas clic en enlaces sospechosos.",
    },
    {
        title: "🧠 ¿Mi contraseña tiene que ser difícil de recordar?",
        heading: "Contraseñas memorables = Más seguridad",
        text: "Usa frases largas o combina palabras significativas. Es más fácil de recordar y sigue siendo segura.",
    },
    {
        title: "📈 ¿Cuánto tarda en romperse una contraseña?",
        heading: "El tiempo importa",
        text: "Las contraseñas cortas pueden romperse en segundos con fuerza bruta. Una buena contraseña puede tardar siglos en descifrarse.",
    },
    {
        title: "🛡️ ¿Qué es un gestor de contraseñas?",
        heading: "Tu mejor aliado",
        text: "Un gestor guarda contraseñas únicas y complejas para cada sitio. Solo necesitas recordar una contraseña maestra.",
    },

    {
        title: "🗝️ ¿Qué es una contraseña de un solo uso?",
        heading: "Seguridad temporal",
        text: "Las contraseñas de un solo uso son válidas por un corto período. Son útiles para transacciones sensibles o autenticación de dos factores.",
    },
];

export function PasswordTips() {
    const [activeTip, setActiveTip] = useState(null);
    const dialogRef = useRef(null);

    useEffect(() => {
        if (activeTip && dialogRef.current) {
            dialogRef.current.showModal();
        } else if (!activeTip && dialogRef.current) {
            dialogRef.current.close();
        }
    }, [activeTip]);

    return (
        <div className="password-tips-container">
            <h1 className="tips-title">💡 Consejos de Seguridad</h1>
            
            <div className="tips-grid">
                {tips.map((tip, index) => (
                    <div key={index} className="tip-card">
                        <button 
                            className="tip-button"
                            onClick={() => setActiveTip(tip)}
                            aria-label={`Leer consejo sobre: ${tip.title}`}
                        >
                            {tip.title}
                        </button>
                    </div>
                ))}
            </div>

            <dialog 
                ref={dialogRef} 
                className="tip-dialog"
                onClose={() => setActiveTip(null)}
                aria-modal="true"
                role="dialog"
            >
                {activeTip && (
                    <div className="dialog-content">
                        <h2 className="dialog-heading">{activeTip.heading}</h2>
                        <p className="dialog-text">{activeTip.text}</p>
                        <div className="dialog-actions">
                            <form method="dialog">
                                <button 
                                    className="close-button"
                                    onClick={() => setActiveTip(null)}
                                    type="button"
                                >
                                    Cerrar
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </dialog>
        </div>
    );
}
