---
title: Créer une Application TODO List Moderne avec Laravel 12, Vue.js et Inertia.js 2.0
description: Ce tutoriel vous guidera dans la création d'une application TODO list moderne en appliquant les principes SOLID et les meilleures pratiques de 2025.
date: '2025-07-13'
published: true
categories:
  - Laravel
  - Inertia.js
  - Vue.js
  - PHP
author: Axel Deneu
slug:
  fr: creer-une-application-todo-list-moderne-avec-laravel-12-vuejs-et-inertiajs-20
  en: create-a-modern-todo-list-app-with-laravel-12-vuejs-and-inertiajs-20
---

Laravel 12, sorti en février 2025, marque une évolution majeure dans l'écosystème Laravel avec ses nouveaux starter kits et l'intégration native d'Inertia.js 2.0. Ce tutoriel vous guidera dans la création d'une application TODO list moderne en appliquant les principes SOLID et les meilleures pratiques de 2025.

## Architecture moderne avec le stack VILT

Le stack VILT (Vue + Inertia + Laravel + Tailwind) s'impose comme le standard en 2025 pour les SPA Laravel. Cette architecture combine la puissance du routing côté serveur avec l'interactivité côté client, offrant le meilleur des deux mondes sans nécessiter d'API REST séparée.

### Installation et configuration initiale

Commençons par créer un nouveau projet Laravel 12 avec le starter kit Vue :

#### Créer le projet Laravel 12

```bash
laravel new todo-app
```

#### Installer le starter kit Vue avec Inertia.js 2.0

```bash
cd todo-app
composer require laravel/breeze --dev
php artisan breeze:install vue --typescript
```

#### Installer les dépendances et compiler les assets

```bash
npm install
npm run dev
```

Laravel 12 introduit des starter kits entièrement repensés qui remplacent Breeze et Jetstream. Le nouveau starter kit Vue inclut :

- Inertia.js 2.0 avec support TypeScript natif
- Vue 3 avec Composition API
- Tailwind CSS 4
- Authentification complète avec Laravel Sanctum
- Support des passkeys et SSO via WorkOS AuthKit

### Configuration TypeScript pour Vue 3

Créons une configuration TypeScript robuste pour notre projet. Voici le fichier `tsconfig.json` optimisé :

```json
{
	"extends": "@vue/tsconfig/tsconfig.web.json",
	"compilerOptions": {
		"target": "esnext",
		"module": "esnext",
		"moduleResolution": "node",
		"strict": true,
		"jsx": "preserve",
		"sourceMap": true,
		"resolveJsonModule": true,
		"esModuleInterop": true,
		"lib": ["esnext", "dom"],
		"types": ["vite/client", "@types/node"],
		"baseUrl": ".",
		"paths": {
			"@/*": ["resources/js/*"]
		}
	},
	"include": ["resources/**/*.ts", "resources/**/*.vue"],
	"exclude": ["node_modules", "public"]
}
```

Définissons maintenant les types pour notre application TODO :

```typescript
// resources/js/types/todo.ts
export interface Todo {
	id: number;
	title: string;
	description?: string;
	completed: boolean;
	priority: 'low' | 'medium' | 'high';
	due_date?: string;
	created_at: string;
	updated_at: string;
	user_id: number;
}
export interface TodoFormData {
	title: string;
	description?: string;
	priority: 'low' | 'medium' | 'high';
	due_date?: string;
}
export interface PaginatedTodos {
	data: Todo[];
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}
```

## Application des principes SOLID

L'implémentation des principes SOLID garantit un code maintenable et évolutif. Voici comment les appliquer dans notre contexte Laravel/Vue.

### Single Responsibility Principle (SRP)

Créons des classes Laravel avec une responsabilité unique :

```php
// app/Actions/CreateTodoAction.php
namespace App\Actions;

use App\Models\Todo;
use App\Repositories\TodoRepository;
use App\Services\NotificationService;

class CreateTodoAction
{
    public function __construct(
        private TodoRepository $todoRepository,
        private NotificationService $notificationService
    ) {}

    public function execute(array $data, int $userId): Todo
    {
        $todo = $this->todoRepository->create([
            ...$data,
            'user_id' => $userId
        ]);

        $this->notificationService->notifyTodoCreated($todo);

        return $todo;
    }
}
```

```php
// app/Repositories/TodoRepository.php
namespace App\Repositories;

use App\Models\Todo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TodoRepository
{
    public function create(array $data): Todo
    {
        return Todo::create($data);
    }

    public function paginateByUser(int $userId, int $perPage = 10): LengthAwarePaginator
    {
        return Todo::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function update(Todo $todo, array $data): bool
    {
        return $todo->update($data);
    }

    public function delete(Todo $todo): bool
    {
        return $todo->delete();
    }
}
```

### Open/Closed Principle et Dependency Inversion

Utilisons des interfaces pour permettre l'extension sans modification :

```php
// app/Contracts/NotificationInterface.php
namespace App\Contracts;

use App\Models\Todo;

interface NotificationInterface
{
    public function send(Todo $todo): void;
}

// app/Services/EmailNotificationService.php
namespace App\Services;

use App\Contracts\NotificationInterface;
use App\Models\Todo;
use App\Mail\TodoCreatedMail;
use Illuminate\Support\Facades\Mail;

class EmailNotificationService implements NotificationInterface
{
    public function send(Todo $todo): void
    {
        Mail::to($todo->user)->send(new TodoCreatedMail($todo));
    }
}

// app/Providers/AppServiceProvider.php
public function register()
{
    $this->app->bind(
        \App\Contracts\NotificationInterface::class,
        \App\Services\EmailNotificationService::class
    );
}
```

## Authentification avec Laravel Sanctum

Laravel 12 intègre Sanctum de manière transparente avec les nouveaux starter kits. Configurons l'authentification pour notre SPA :

```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1',
    Sanctum::currentApplicationUrlWithPort()
))),

// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->statefulApi();
})
```

Créons un composable Vue pour gérer l'état d'authentification :

```typescript
// resources/js/composables/useAuth.ts
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import type { User } from '@/types/user';

const user = ref<User | null>(null);

export function useAuth() {
	const isAuthenticated = computed(() => !!user.value);

	const login = async (credentials: { email: string; password: string }) => {
		await router.post('/login', credentials);
	};

	const logout = async () => {
		await router.post('/logout');
		user.value = null;
	};

	const updateUser = (newUser: User | null) => {
		user.value = newUser;
	};

	return {
		user: computed(() => user.value),
		isAuthenticated,
		login,
		logout,
		updateUser
	};
}
```

## Implémentation du CRUD avec pagination

Créons maintenant le contrôleur principal en respectant les principes SOLID :

```php
// app/Http/Controllers/TodoController.php
namespace App\Http\Controllers;

use App\Actions\CreateTodoAction;
use App\Actions\UpdateTodoAction;
use App\Actions\DeleteTodoAction;
use App\Http\Requests\TodoRequest;
use App\Models\Todo;
use App\Repositories\TodoRepository;
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
    public function __construct(
        private TodoRepository $todoRepository
    ) {}

    public function index(): Response
    {
        $todos = $this->todoRepository->paginateByUser(
            auth()->id(),
            request()->get('per_page', 10)
        );

        return Inertia::render('Todos/Index', [
            'todos' => $todos,
            'filters' => request()->only(['search', 'status', 'priority'])
        ]);
    }

    public function store(TodoRequest $request, CreateTodoAction $action)
    {
        $todo = $action->execute(
            $request->validated(),
            auth()->id()
        );

        return redirect()->route('todos.index')
            ->with('success', 'Tâche créée avec succès');
    }

    public function update(TodoRequest $request, Todo $todo, UpdateTodoAction $action)
    {
        $this->authorize('update', $todo);

        $action->execute($todo, $request->validated());

        return redirect()->back()
            ->with('success', 'Tâche mise à jour');
    }

    public function destroy(Todo $todo, DeleteTodoAction $action)
    {
        $this->authorize('delete', $todo);

        $action->execute($todo);

        return redirect()->back()
            ->with('success', 'Tâche supprimée');
    }
}
```

Créons maintenant l'interface Vue avec Composition API et TypeScript :

```vue
<!-- resources/js/Pages/Todos/Index.vue -->
<template>
	<AuthenticatedLayout>
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="rounded-lg bg-white shadow-sm">
				<TodoForm @created="handleTodoCreated" />

				<div class="p-6">
					<TodoFilters v-model="filters" @update="applyFilters" />

					<div class="mt-6 space-y-4">
						<TransitionGroup name="list">
							<TodoItem
								v-for="todo in todos.data"
								:key="todo.id"
								:todo="todo"
								@toggle="toggleTodo"
								@delete="deleteTodo"
							/>
						</TransitionGroup>
					</div>

					<Pagination v-if="todos.last_page > 1" :links="todos.links" class="mt-6" />
				</div>
			</div>
		</div>
	</AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { router, usePage } from '@inertiajs/vue3';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import TodoForm from '@/Components/TodoForm.vue';
import TodoItem from '@/Components/TodoItem.vue';
import TodoFilters from '@/Components/TodoFilters.vue';
import Pagination from '@/Components/Pagination.vue';
import type { PaginatedTodos, Todo } from '@/types/todo';

interface Props {
	todos: PaginatedTodos;
	filters: {
		search?: string;
		status?: 'all' | 'completed' | 'pending';
		priority?: 'low' | 'medium' | 'high';
	};
}

const props = defineProps<Props>();
const page = usePage();

const filters = ref(props.filters);

const handleTodoCreated = () => {
	router.reload({ only: ['todos'] });
};

const toggleTodo = (todo: Todo) => {
	router.patch(
		`/todos/${todo.id}`,
		{
			completed: !todo.completed
		},
		{
			preserveState: true,
			preserveScroll: true
		}
	);
};

const deleteTodo = (todo: Todo) => {
	if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
		router.delete(`/todos/${todo.id}`, {
			preserveState: true,
			preserveScroll: true
		});
	}
};

const applyFilters = () => {
	router.get('/todos', filters.value, {
		preserveState: true,
		replace: true
	});
};
</script>
```

## Utilisation de Pinia pour la gestion d'état

Pinia remplace Vuex comme solution de gestion d'état recommandée pour Vue 3. Créons un store pour nos todos :

```typescript
// resources/js/stores/todoStore.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { router } from '@inertiajs/vue3';
import type { Todo, TodoFormData } from '@/types/todo';

export const useTodoStore = defineStore('todo', () => {
	const todos = ref<Todo[]>([]);
	const loading = ref(false);
	const currentFilter = ref<'all' | 'completed' | 'pending'>('all');

	const filteredTodos = computed(() => {
		switch (currentFilter.value) {
			case 'completed':
				return todos.value.filter((todo) => todo.completed);
			case 'pending':
				return todos.value.filter((todo) => !todo.completed);
			default:
				return todos.value;
		}
	});

	const stats = computed(() => ({
		total: todos.value.length,
		completed: todos.value.filter((t) => t.completed).length,
		pending: todos.value.filter((t) => !t.completed).length
	}));

	const createTodo = async (data: TodoFormData) => {
		loading.value = true;
		try {
			await router.post('/todos', data);
		} finally {
			loading.value = false;
		}
	};

	const updateFilter = (filter: typeof currentFilter.value) => {
		currentFilter.value = filter;
	};

	return {
		todos,
		loading,
		currentFilter,
		filteredTodos,
		stats,
		createTodo,
		updateFilter
	};
});
```

## Nouvelles fonctionnalités d'Inertia.js 2.0

Inertia.js 2.0 apporte des améliorations significatives. Exploitons le polling et les props différées :

```php
// app/Http/Controllers/DashboardController.php
public function index()
{
    return Inertia::render('Dashboard', [
        'stats' => [
            'total_todos' => auth()->user()->todos()->count(),
            'completed_today' => auth()->user()->todos()
                ->whereDate('completed_at', today())
                ->count(),
        ],
        // Props différées pour améliorer les performances
        'recent_todos' => Inertia::defer(function () {
            return auth()->user()->todos()
                ->latest()
                ->take(5)
                ->get();
        }),
        'activity_chart' => Inertia::defer(function () {
            return $this->generateActivityChart();
        }, 'charts'), // Groupe de props différées
    ]);
}
```

Utilisons le polling côté client pour les mises à jour en temps réel :

```vue
<script setup lang="ts">
import { usePoll } from '@inertiajs/vue3';

// Polling automatique toutes les 30 secondes
usePoll(30000, {
	only: ['stats', 'recent_todos']
});
</script>
```

## Optimisations pour la production

### Configuration Vite optimisée

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
	plugins: [
		laravel({
			input: ['resources/css/app.css', 'resources/js/app.ts'],
			ssr: 'resources/js/ssr.ts',
			refresh: true
		}),
		vue({
			template: {
				transformAssetUrls: {
					base: null,
					includeAbsolute: false
				}
			}
		})
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['vue', 'pinia', '@inertiajs/vue3'],
					ui: ['@headlessui/vue', '@heroicons/vue']
				}
			}
		}
	}
});
```

### Docker pour le déploiement

Créons un Dockerfile multi-étapes optimisé :

```dockerfile
# Stage 1: Build
FROM node:20-alpine as frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY .. .
RUN npm run build

FROM php:8.3-fpm-alpine as backend-builder
RUN apk add --no-cache \
    postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql opcache

WORKDIR /var/www
COPY composer.* ./
RUN composer install --no-dev --optimize-autoloader

# Stage 2: Production
FROM php:8.3-fpm-alpine
RUN apk add --no-cache nginx supervisor postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql opcache

WORKDIR /var/www
COPY --from=backend-builder /var/www/vendor ./vendor
COPY --from=frontend-builder /app/public/build ./public/build
COPY .. .

RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 80
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
```

### Sécurité et performance

Implémentons les headers de sécurité et le cache :

```php
// app/Http/Middleware/SecurityHeaders.php
namespace App\Http\Middleware;

class SecurityHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set('Content-Security-Policy', "default-src 'self'");

        return $response;
    }
}
```

## Conclusion

Cette architecture moderne combinant Laravel 12, Vue.js 3 et Inertia.js 2.0 offre une base solide pour développer des applications SPA performantes et maintenables. L'application des principes SOLID garantit un code évolutif, tandis que les nouvelles fonctionnalités d'Inertia.js 2.0 comme le polling et les props différées améliorent significativement l'expérience utilisateur.

Les points clés à retenir sont l'importance de TypeScript pour la sécurité des types, l'utilisation de Pinia pour une gestion d'état moderne, et l'adoption des meilleures pratiques de sécurité dès le début du projet. Avec cette fondation, vous êtes prêt à construire des applications web modernes qui répondent aux standards de 2025.
