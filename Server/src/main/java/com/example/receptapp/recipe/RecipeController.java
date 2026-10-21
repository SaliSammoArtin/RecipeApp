package com.example.receptapp.recipe;

import com.example.receptapp.user.User;
import com.example.receptapp.user.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeRepository recipeRepository;
    private final UserRepository userRepository;

    @GetMapping
    public List<Recipe> getRecipes() {
        return recipeRepository.findAll();
    }

    @GetMapping("/{id}")
    public Recipe getRecipe(@PathVariable Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receptet finns inte"));
    }

    @PostMapping
    public Recipe createRecipe(
            @Valid
            @RequestBody Recipe recipe,
            @AuthenticationPrincipal Jwt jwt
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "Användaren finns inte"));

        recipe.setId(null);
        recipe.setOwner(user);

        return recipeRepository.save(recipe);
    }

    @PatchMapping("/{id}")
    public Recipe changeRecipe(
            @PathVariable Long id,
            @RequestBody Recipe changes,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Recipe existing = recipeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receptet finns inte"));

        UUID userId = UUID.fromString(jwt.getSubject());

        if (existing.getOwner() == null
                || !existing.getOwner().getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Du får inte ändra detta recept");
        }

        if (changes.getTitle() != null) {
            existing.setTitle(changes.getTitle());
        }
        if (changes.getCategory() != null) {
            existing.setCategory(changes.getCategory());
        }
        if (changes.getIngredients() != null) {
            existing.setIngredients(changes.getIngredients());
        }
        if (changes.getInstructions() != null) {
            existing.setInstructions(changes.getInstructions());
        }

        if (!StringUtils.hasText(existing.getTitle())
                || !StringUtils.hasText(existing.getCategory())
                || !StringUtils.hasText(existing.getIngredients())
                || !StringUtils.hasText(existing.getInstructions())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Alla receptfält måste innehålla text");
        }

        return recipeRepository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receptet finns inte"));

        UUID userId = UUID.fromString(jwt.getSubject());

        if (recipe.getOwner() == null
                || !recipe.getOwner().getId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Du får inte ta bort detta recept");
        }

        recipeRepository.delete(recipe);
        return ResponseEntity.noContent().build();
    }
}
