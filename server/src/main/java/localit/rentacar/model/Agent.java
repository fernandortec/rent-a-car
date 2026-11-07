package localit.rentacar.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "agents")
public class Agent {

  public enum Type {
    COMPANY,
    BANK,
  }

  @Id
  private UUID id;

  @Column(nullable = false)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private Type type;

  @Column(nullable = false, columnDefinition = "boolean default true")
  private boolean active = true;

  public boolean isActive() {
    return active;
  }

  public void setActive(boolean active) {
    this.active = active;
  }

  public Agent() {}

  public Agent(UUID id, String name, Type type) {
    this.id = id;
    this.name = name;
    this.type = type;
  }

  public UUID getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public Type getType() {
    return type;
  }
}
