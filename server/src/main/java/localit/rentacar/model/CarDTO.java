package localit.rentacar.model;

public record CarDTO(Long id, String brand, String model, int year) {
  public static CarDTO from(Car c) {
    return new CarDTO(c.getId(), c.getBrand(), c.getModel(), c.getYear());
  }
}
