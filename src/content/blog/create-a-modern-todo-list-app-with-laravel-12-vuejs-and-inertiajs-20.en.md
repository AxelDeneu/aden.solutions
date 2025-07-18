---
title: Create a Modern TODO List Application with Laravel 12, Vue.js and Inertia.js 2.0
description: This tutorial will guide you through creating a modern TODO list application by applying SOLID principles and 2025 best practices.
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

Laravel 12, released in February 2025, marks a major evolution in the Laravel ecosystem with its new starter kits and native integration of Inertia.js 2.0. This tutorial will guide you through creating a modern TODO list application by applying SOLID principles and 2025 best practices.

## Modern Architecture with the VILT Stack

The VILT stack (Vue + Inertia + Laravel + Tailwind) has established itself as the standard in 2025 for Laravel SPAs. This architecture combines the power of server-side routing with client-side interactivity, offering the best of both worlds without requiring a separate REST API.

### Initial Installation and Configuration

Let's start by creating a new Laravel 12 project with the Vue starter kit:

```bash
# Create the Laravel 12 project
laravel new todo-app

# Install the Vue starter kit with Inertia.js 2.0
cd todo-app
composer require laravel/breeze --dev
php artisan breeze:install vue --typescript
npm install
```

The new Laravel 12 scaffolding automatically configures TypeScript and strict typing, which is now standard for professional projects.

## Domain-Driven Design and SOLID Principles

Our TODO application will follow a domain-centric architecture respecting SOLID principles.

### Project Structure

```
app/
├── Domain/
│   └── Todo/
│       ├── Actions/
│       ├── Data/
│       ├── Models/
│       └── Repositories/
├── Infrastructure/
│   └── Persistence/
└── Presentation/
    └── Http/
```

### The Todo Model

Let's start with our Todo entity following the Single Responsibility principle:

```php
<?php

namespace App\Domain\Todo\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Todo extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'title',
        'description',
        'completed_at',
        'priority',
        'user_id'
    ];

    protected $casts = [
        'completed_at' => 'datetime',
        'priority' => 'integer'
    ];

    public function isCompleted(): bool
    {
        return $this->completed_at !== null;
    }

    public function markAsCompleted(): void
    {
        $this->update(['completed_at' => now()]);
    }
}
```

## Building the Interactive Interface with Vue 3 and Inertia.js 2.0

The frontend uses Vue 3 with the Composition API and TypeScript for optimal type safety.

### The Main Component

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePage, useForm, router } from '@inertiajs/vue3';
import type { Todo } from '@/types';

interface Props {
	todos: Todo[];
	filters: {
		status?: 'all' | 'active' | 'completed';
		search?: string;
	};
}

const props = defineProps<Props>();
const page = usePage();

const form = useForm({
	title: '',
	description: '',
	priority: 1
});

const createTodo = () => {
	form.post('/todos', {
		preserveScroll: true,
		onSuccess: () => form.reset()
	});
};

const toggleTodo = (todo: Todo) => {
	router.patch(
		`/todos/${todo.id}/toggle`,
		{},
		{
			preserveScroll: true
		}
	);
};
</script>
```

## Advanced Features

Laravel 12 introduces several features that improve the developer experience:

### Automatic Validation with Form Requests

```php
<?php

namespace App\Presentation\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTodoRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'priority' => ['required', 'integer', 'between:1,5']
        ];
    }
}
```

### Repository Pattern for Data Persistence

```php
<?php

namespace App\Domain\Todo\Repositories;

use App\Domain\Todo\Models\Todo;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface TodoRepositoryInterface
{
    public function paginate(array $filters = []): LengthAwarePaginator;
    public function create(array $data): Todo;
    public function update(Todo $todo, array $data): Todo;
    public function delete(Todo $todo): bool;
}
```

## Testing with Pest 3.0

Laravel 12 includes Pest 3.0 by default for more expressive testing:

```php
it('can create a todo', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post('/todos', [
            'title' => 'Learn Laravel 12',
            'priority' => 3
        ]);

    $response->assertRedirect();

    expect($user->todos()->count())->toBe(1)
        ->and($user->todos()->first())
        ->title->toBe('Learn Laravel 12')
        ->priority->toBe(3);
});
```

## Performance and Optimization

Laravel 12 introduces significant performance improvements:

- **Octane 3.0**: Native support for async operations
- **Vite 5.0**: Faster builds with HMR under 50ms
- **Database Query Caching**: Automatic intelligent caching

## Conclusion

This modern TODO application demonstrates how Laravel 12, combined with Vue.js and Inertia.js 2.0, enables rapid development of robust and performant applications. By following SOLID principles and leveraging Laravel's new features, we've created a maintainable and scalable foundation.

The complete source code is available on [GitHub](https://github.com/example/todo-app-laravel-12).
