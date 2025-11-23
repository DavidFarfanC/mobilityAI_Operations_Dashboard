import { useLineStatus, useStations, useRecentFallDetections } from '../services/hooks';
import { resetSimulation } from '../services/metroApi';
import { createFallDetection } from '../services/fallDetectionApi';

/**
 * Componente de ejemplo que muestra cómo integrar la API del backend
 * Puedes usar este código como referencia para integrar en tus componentes existentes
 */
export const MetroIntegrationExample = () => {
  // Hook para obtener el estado de la línea (se actualiza cada 3 segundos)
  const { data: lineStatus, isLoading: loadingStatus, error: errorStatus } = useLineStatus();
  
  // Hook para obtener las estaciones (se actualiza cada 5 segundos)
  const { data: stations, isLoading: loadingStations } = useStations();
  
  // Hook para obtener incidentes recientes de caídas
  const { data: recentIncidents, isLoading: loadingIncidents } = useRecentFallDetections();

  // Ejemplo de cómo reiniciar la simulación
  const handleResetSimulation = async () => {
    try {
      const result = await resetSimulation();
      console.log('Simulación reiniciada:', result);
      alert(result.message);
    } catch (error) {
      console.error('Error al reiniciar:', error);
      alert('Error al reiniciar la simulación');
    }
  };

  // Ejemplo de cómo reportar un incidente con imagen
  const handleReportIncident = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await createFallDetection(
        file,
        'Observatorio', // Nombre de la estación
        'persona', // Objeto detectado
        new Date() // Fecha y hora del incidente
      );
      console.log('Incidente reportado:', result);
      alert(`Incidente registrado: ${result.message}`);
    } catch (error) {
      console.error('Error al reportar incidente:', error);
      alert('Error al reportar el incidente');
    }
  };

  if (errorStatus) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded">
        <p>Error al conectar con el backend: {String(errorStatus)}</p>
        <p className="text-sm mt-2">Verifica que el backend esté corriendo en:</p>
        <code className="text-xs">http://ec2-54-84-92-63.compute-1.amazonaws.com</code>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Integración con Backend - Ejemplo</h2>

      {/* Estado de la Línea */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">Estado de la Línea 1</h3>
        {loadingStatus ? (
          <p>Cargando...</p>
        ) : lineStatus ? (
          <div className="space-y-2">
            <p><strong>Línea:</strong> {lineStatus.line_name}</p>
            <p><strong>Ruta:</strong> {lineStatus.route}</p>
            <p><strong>Saturación:</strong> {lineStatus.saturation}</p>
            <p><strong>Trenes activos:</strong> {lineStatus.active_trains.length}</p>
            <p><strong>Última actualización:</strong> {new Date(lineStatus.last_updated).toLocaleString()}</p>
            {lineStatus.incident_type !== 'none' && (
              <p className="text-red-600">
                <strong>⚠️ Incidente:</strong> {lineStatus.incident_message}
              </p>
            )}
            
            {/* Lista de trenes */}
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Trenes:</h4>
              <div className="space-y-2">
                {lineStatus.active_trains.map((train) => (
                  <div key={train.train_id} className="border p-2 rounded">
                    <p><strong>{train.train_id}</strong></p>
                    <p className="text-sm">
                      {train.current_station} → {train.next_station}
                    </p>
                    <p className="text-sm">
                      Dirección: {train.direction} | Progreso: {(train.progress_to_next * 100).toFixed(0)}%
                    </p>
                    <p className="text-sm">
                      Vagones: {train.wagons} | Pasajeros: {train.passengers_per_wagon.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>No hay datos disponibles</p>
        )}
      </section>

      {/* Estaciones */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">Estaciones ({stations?.length || 0})</h3>
        {loadingStations ? (
          <p>Cargando estaciones...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {stations?.slice(0, 6).map((station) => (
              <div key={station.id} className="border p-3 rounded">
                <p className="font-semibold">{station.name}</p>
                <p className="text-sm">Saturación: {station.saturation}</p>
                <p className="text-sm">Personas esperando: {station.people_waiting}</p>
                <p className="text-sm">Próximo tren: {station.next_train_arrival} min</p>
                {station.has_incident && (
                  <p className="text-red-600 text-sm">⚠️ {station.incident_message}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Incidentes de Caídas */}
      <section className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-3">Incidentes Recientes (últimas 24h)</h3>
        {loadingIncidents ? (
          <p>Cargando incidentes...</p>
        ) : recentIncidents && recentIncidents.length > 0 ? (
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <div key={incident.id} className="border p-3 rounded flex gap-3">
                <img 
                  src={incident.image_url} 
                  alt="Incidente" 
                  className="w-24 h-24 object-cover rounded"
                />
                <div>
                  <p><strong>Estación:</strong> {incident.station}</p>
                  <p><strong>Objeto:</strong> {incident.detected_object}</p>
                  <p><strong>Fecha:</strong> {new Date(incident.incident_datetime).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay incidentes recientes</p>
        )}
      </section>

      {/* Controles */}
      <section className="bg-white p-4 rounded-lg shadow space-y-3">
        <h3 className="text-xl font-semibold mb-3">Controles</h3>
        
        <button
          onClick={handleResetSimulation}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Reiniciar Simulación
        </button>

        <div>
          <label className="block mb-2 font-semibold">Reportar Incidente:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleReportIncident}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          <p className="text-sm text-gray-500 mt-1">
            Selecciona una imagen para reportar un incidente
          </p>
        </div>
      </section>

      {/* Información */}
      <section className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">💡 Cómo usar esta integración:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Los datos se actualizan automáticamente cada 3-5 segundos</li>
          <li>Usa los hooks <code>useLineStatus()</code>, <code>useStations()</code>, etc.</li>
          <li>Para reportar incidentes usa <code>createFallDetection()</code></li>
          <li>Todos los servicios están en <code>src/services/</code></li>
          <li>Los tipos están definidos en <code>src/types.ts</code></li>
        </ul>
      </section>
    </div>
  );
};
