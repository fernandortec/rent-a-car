package localit.rentacar.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "clients")
public class Client {

  @Id
  private UUID id;

  private String name;

  @Column(unique = true, length = 11)
  private String cpf;

  private String address;

  protected Client() {}

  public Client(UUID id) {
    this.id = id;
  }

  public void update(ClientInput input) {
    name = input.name().trim();
    cpf = input.cpf();
    address = input.address().trim();
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getCpf() {
    return cpf;
  }

  public String getAddress() {
    return address;
  }
}
