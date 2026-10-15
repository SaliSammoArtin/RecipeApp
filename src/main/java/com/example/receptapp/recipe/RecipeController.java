package com.example.receptapp.recipe;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeRepository recipeRepository;

    @GetMapping
    public List<Recipe> getRecipes() {
        return recipeRepository.findAll();
    }

    @PostMapping
    public Recipe createRecipe(
            @RequestBody Recipe recipe
    ) {
        return recipeRepository.save(recipe);
    }
    //@PatchMapping
    //@DeleteMapping
}
