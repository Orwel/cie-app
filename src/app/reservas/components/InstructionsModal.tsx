'use client';

import { X } from 'lucide-react';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  machine: 'blanca' | 'gris';
}

export default function InstructionsModal({ isOpen, onClose, machine }: InstructionsModalProps) {
  if (!isOpen) return null;

  const instructionsBlanca = {
    title: '🧺 Instrucciones para usar la torre lavadora blanca',
    subtitle: '(lavadora + secadora)',
    sections: [
      {
        title: '1️⃣ Lavado (parte de abajo)',
        steps: [
          {
            title: '🔄 Acomoda las perillas',
            text: 'Gira siempre las tuercas/perillas hacia las manecillas del reloj para "reiniciarlas".'
          },
          {
            title: '🚿 Programa el lavado',
            text: 'En la perilla de la izquierda, donde dice "WASH", gírala hasta que la flecha quede apuntando en 18. Jala el botón hacia afuera 👉 y la lavadora empezará a llenarse de agua.'
          },
          {
            title: '🧴 Añade el detergente',
            text: 'Agrega el detergente cuando empiece a llenarse de agua.'
          },
          {
            title: '⏳ Déjala en remojo',
            text: 'Se recomienda dejar la ropa en remojo unos 30 minutos para que el detergente actúe mejor.'
          },
          {
            title: '▶️ Activa el ciclo de lavado',
            text: 'Después del remojo, vuelve a presionar el botón (empujarlo hacia adentro) para que la lavadora continúe su ciclo de lavado normal. El lavado tarda aproximadamente 20–30 minutos.'
          }
        ]
      },
      {
        title: '2️⃣ Secado (parte de arriba)',
        steps: [
          {
            title: '🔁 Pasa la ropa a la secadora',
            text: 'Cuando termine el lavado, pasa la carga de la lavadora de abajo a la secadora de arriba.'
          },
          {
            title: '🌬️ Configura el secado',
            text: 'En los botones/perilla de la derecha, donde dice "DRY", selecciona "VERY DRY".'
          },
          {
            title: '🔘 Inicia el secado',
            text: 'Pulsa el botón del centro que dice "PUSH TO START". La secadora empezará a funcionar automáticamente.'
          }
        ]
      }
    ]
  };

  const instructionsGris = {
    title: '🩶 Instrucciones lavadora–secadora gris',
    subtitle: 'Esta máquina lava y seca en el mismo equipo.',
    sections: [
      {
        title: 'Uso general',
        steps: [
          {
            title: '👕 Mete la ropa',
            text: 'Coloca la ropa dentro del tambor, sin sobrellenarla.'
          },
          {
            title: '🧴 Pon el detergente',
            text: 'Echa el detergente (preferiblemente líquido) en el compartimento extraíble.'
          },
          {
            title: '⚡ Elige el programa',
            text: 'En el círculo de opciones después de pulsar botón "inicio".'
          },
          {
            title: '🌞 Activa el secado automático',
            text: 'En la pantalla táctil, toca la opción "DRY" para que lave y seque automáticamente.'
          },
          {
            title: '▶️ Comienza el ciclo',
            text: 'Pulsa Start y el equipo hará todo el proceso.'
          }
        ]
      }
    ]
  };

  const instructions = machine === 'blanca' ? instructionsBlanca : instructionsGris;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">{instructions.title}</h2>
            {instructions.subtitle && (
              <p className="text-sm text-gray-400 mt-1">{instructions.subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {instructions.sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
              <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
              <div className="space-y-4">
                {section.steps.map((step, stepIdx) => (
                  <div key={stepIdx} className="bg-gray-800/50 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

