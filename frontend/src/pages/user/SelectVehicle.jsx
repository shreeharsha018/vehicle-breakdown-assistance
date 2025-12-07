import { useNavigate } from 'react-router-dom';
import CarIcon from '../../components/CarIcon';
import './SelectVehicle.css';

export default function SelectVehicle() {
  const navigate = useNavigate();

  const vehicles = [
    {
      id: '2-wheeler',
      name: '2-Wheeler',
      icon: '🏍️',
      description: 'Bikes, Scooters'
    },
    {
      id: '3-wheeler',
      name: '3-Wheeler',
      icon: '🛺',
      description: 'Auto Rickshaw'
    },
    {
      id: '4-wheeler',
      name: '4-Wheeler',
      icon: <CarIcon size={36} color="#ff6b00" />,
      description: 'Cars, SUVs'
    }
  ];

  const handleSelectVehicle = (vehicleType) => {
    navigate(`/problems/${vehicleType}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Select Your Vehicle Type</h1>
        <p>Choose your vehicle to see available problems and solutions</p>
      </div>

      <div className="vehicle-selector">
        {vehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className="vehicle-option"
            onClick={() => handleSelectVehicle(vehicle.id)}
          >
            <div className="vehicle-option-icon">{vehicle.icon}</div>
            <h3>{vehicle.name}</h3>
            <p>{vehicle.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}