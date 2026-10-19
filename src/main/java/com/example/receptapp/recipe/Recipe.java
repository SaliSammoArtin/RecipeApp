package com.example.receptapp.recipe;

import com.example.receptapp.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank
    private String title;
    @NotBlank
    private String category;

    @ManyToOne
    @JsonIgnore
    private User owner;

    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String ingredients;
    @NotBlank
    @Column(columnDefinition = "TEXT")
    private String instructions;
}