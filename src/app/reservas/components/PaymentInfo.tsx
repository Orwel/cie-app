'use client';

export default function PaymentInfo() {
  return (
    <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
        <span className="text-2xl">💰</span>
        Información de Pago
      </h3>
          <p className="text-gray-300 mb-2">
            El costo por uso de la lavadora es de <span className="font-bold text-white">$20.000 COP</span>
          </p>
          <div className="bg-black/40 rounded p-3 mt-3">
            <p className="text-sm text-gray-400 mb-1">Métodos de pago:</p>
            <ul className="list-disc list-inside text-white space-y-1">
              <li>Efectivo</li>
              <li>
                <span className="font-semibold">Nequi:</span>{' '}
                <a 
                  href="https://wa.me/573113463082" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  311 346 3082
                </a>
              </li>
            </ul>
          </div>
          <div className="mt-3 text-xs text-yellow-400 bg-yellow-900/20 rounded p-2">
            ⚠️ <strong>Importante:</strong> El pago no incluye jabones ni detergente. 
            El usuario es responsable por el uso adecuado de la máquina y cualquier daño potencial.
          </div>
    </div>
  );
}

