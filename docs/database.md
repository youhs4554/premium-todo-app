# Database Documentation

The application uses **SQLite** with the **SQLAlchemy** ORM for data persistence.

## 🗃️ Tables

### `users`
Stores user account information.
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `email` | String | Unique, Indexed, Not Null |
| `hashed_password` | String | Not Null |
| `full_name` | String | |

### `todos`
Stores task items.
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key |
| `title` | String | Indexed, Not Null |
| `description` | String | |
| `completed` | Boolean | Default: False |
| `created_at` | DateTime | Server Default: Now |
| `updated_at` | DateTime | On Update: Now |
| `user_id` | Integer | Foreign Key -> `users.id` |

## 🔗 Relationships

- **One-to-Many**: A `User` can have multiple `Todo` items.
- **Cascade**: Deleting a user will automatically delete all their associated tasks (`delete-orphan`).
