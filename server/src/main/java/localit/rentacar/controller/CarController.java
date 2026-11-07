package localit.rentacar.controller;

import java.util.List;
import localit.rentacar.model.CarDTO;
import localit.rentacar.repository.CarRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cars")
public class CarController {

  private final CarRepository cars;

  public CarController(CarRepository cars) {
    this.cars = cars;
  }

  @GetMapping
  public List<CarDTO> list() {
    return cars
      .findAll(Sort.by("brand", "model", "id"))
      .stream()
      .map(CarDTO::from)
      .toList();
  }
}
