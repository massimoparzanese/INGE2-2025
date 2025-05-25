export default function ProductCard ({title, subtitle, imageUrl, content,reference = {} ,customButton = {}}) {
 return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg `}>
      {/* Imagen */}
      <div className="h-48 overflow-hidden">
        <img 
          className="w-full h-full object-cover"
          src={imageUrl} 
          alt={title}
        />
      </div>
      
      {/* Contenido */}
      <div className="p-6">
        {/* Título y subtítulo */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        {/* Contenido principal */}
        <p className="text-gray-600 mb-4">{content}</p>
        
        {/* Referencia (opcional) */}
        {reference && (
            <a
              href={reference.href}
              target={reference.target || '_self'}
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {reference.text}
            </a>
          )}
          
          {customButton && (
            <div className="ml-auto">
              {customButton}
            </div>
          )}
      </div>
    </div>
  );
};
