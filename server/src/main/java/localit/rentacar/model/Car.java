package localit.rentacar.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cars")
public class Car {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(
    name = "registration_number",
    nullable = false,
    unique = true,
    length = 30
  )
  private String registrationNumber;

  @Column(name = "manufacture_year", nullable = false)
  private int year;

  @Column(nullable = false, length = 80)
  private String brand;

  @Column(nullable = false, length = 120)
  private String model;

  @Column(name = "license_plate", nullable = false, unique = true, length = 10)
  private String licensePlate;

  protected Car() {}

  public Car(
    String registrationNumber,
    int year,
    String brand,
    String model,
    String licensePlate
  ) {
    this.registrationNumber = registrationNumber;
    this.year = year;
    this.brand = brand;
    this.model = model;
    this.licensePlate = licensePlate;
  }

  public Long getId() {
    return id;
  }

  public String getRegistrationNumber() {
    return registrationNumber;
  }

  public int getYear() {
    return year;
  }

  public String getBrand() {
    return brand;
  }

  public String getModel() {
    return model;
  }

  public String getLicensePlate() {
    return licensePlate;
  }
}
