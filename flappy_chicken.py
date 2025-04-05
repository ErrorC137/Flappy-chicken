import pygame
import random
import sys

# Game setup
pygame.init()
WIDTH, HEIGHT = 400, 600
SCREEN = pygame.display.set_mode((WIDTH, HEIGHT))
CLOCK = pygame.time.Clock()
FPS = 60

# Load chicken breast PNG
CHICKEN_IMG = pygame.image.load("chicken_breast.png").convert_alpha()
CHICKEN_IMG = pygame.transform.scale(CHICKEN_IMG, (50, 35))

# Colors
WHITE = (255, 255, 255)
GREEN = (0, 200, 0)
BLUE = (0, 150, 255)

# Chicken properties
chicken_x = 100
chicken_y = HEIGHT // 2
chicken_velocity = 0
gravity = 0.5
jump_strength = -10

# Pipe settings
pipe_width = 60
pipe_gap = 150
pipe_velocity = 4
pipes = []

# Score
score = 0
font = pygame.font.SysFont("Arial", 32)

def create_pipe():
    height = random.randint(100, 400)
    top_rect = pygame.Rect(WIDTH, 0, pipe_width, height)
    bottom_rect = pygame.Rect(WIDTH, height + pipe_gap, pipe_width, HEIGHT)
    return (top_rect, bottom_rect)

def draw_pipes(pipes):
    for top, bottom in pipes:
        pygame.draw.rect(SCREEN, GREEN, top)
        pygame.draw.rect(SCREEN, GREEN, bottom)

def check_collision(chicken_rect, pipes):
    for top, bottom in pipes:
        if chicken_rect.colliderect(top) or chicken_rect.colliderect(bottom):
            return True
    if chicken_rect.top <= 0 or chicken_rect.bottom >= HEIGHT:
        return True
    return False

# Game loop
pipe_timer = 0
running = True
while running:
    CLOCK.tick(FPS)
    SCREEN.fill(BLUE)

    # Input
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                chicken_velocity = jump_strength

    # Update chicken
    chicken_velocity += gravity
    chicken_y += chicken_velocity
    chicken_rect = pygame.Rect(chicken_x, chicken_y, 50, 35)
    SCREEN.blit(CHICKEN_IMG, (chicken_x, chicken_y))

    # Handle pipes
    pipe_timer += 1
    if pipe_timer > 90:
        pipes.append(create_pipe())
        pipe_timer = 0

    for i in range(len(pipes)):
        pipes[i] = (pipes[i][0].move(-pipe_velocity, 0), pipes[i][1].move(-pipe_velocity, 0))

    pipes = [pair for pair in pipes if pair[0].right > 0]
    draw_pipes(pipes)

    # Check for collisions
    if check_collision(chicken_rect, pipes):
        print(f"Game Over! Final Score: {score}")
        pygame.quit()
        sys.exit()

    # Update score
    for pipe in pipes:
        if pipe[0].right == chicken_x:
            score += 1

    score_text = font.render(f"Score: {score}", True, WHITE)
    SCREEN.blit(score_text, (10, 10))

    pygame.display.update()
