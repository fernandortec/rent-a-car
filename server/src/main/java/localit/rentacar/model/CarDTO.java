package localit.rentacar.model;

public record CarDTO(Long id, String registrationNumber, int year, String brand,
                     String model, String licensePlate) {}
