#include "hash_table.h"

#include <stdlib.h>
#include <string.h>

static size_t hash_key(const char *key, size_t capacity) {
    size_t hash = 14695981039346656037ULL;
    while (*key != '\0') {
        hash ^= (unsigned char)(*key++);
        hash *= 1099511628211ULL;
    }
    return hash % capacity;
}

static void free_entry(HashEntry *entry) {
    if (entry != NULL) {
        free(entry->key);
        entry->key = NULL;
        entry->value = 0;
    }
}

void ht_init(HashTable *table, size_t capacity) {
    if (table == NULL || capacity == 0) {
        return;
    }

    table->entries = (HashEntry *)calloc(capacity, sizeof(HashEntry));
    table->capacity = capacity;
    table->count = 0;
}

void ht_free(HashTable *table) {
    if (table == NULL || table->entries == NULL) {
        return;
    }

    for (size_t i = 0; i < table->capacity; ++i) {
        free_entry(&table->entries[i]);
    }

    free(table->entries);
    table->entries = NULL;
    table->capacity = 0;
    table->count = 0;
}

static int ht_rehash(HashTable *table, size_t new_capacity) {
    HashEntry *old_entries = table->entries;
    size_t old_capacity = table->capacity;
    HashEntry *new_entries = (HashEntry *)calloc(new_capacity, sizeof(HashEntry));
    if (new_entries == NULL) {
        return 0;
    }

    table->entries = new_entries;
    table->capacity = new_capacity;
    table->count = 0;

    for (size_t i = 0; i < old_capacity; ++i) {
        if (old_entries[i].key != NULL) {
            ht_set(table, old_entries[i].key, old_entries[i].value);
            free(old_entries[i].key);
        }
    }

    free(old_entries);
    return 1;
}

int ht_set(HashTable *table, const char *key, int value) {
    if (table == NULL || key == NULL) {
        return 0;
    }

    if (table->entries == NULL) {
        ht_init(table, 16);
    }

    if ((double)table->count / (double)table->capacity >= 0.7) {
        if (!ht_rehash(table, table->capacity * 2)) {
            return 0;
        }
    }

    size_t index = hash_key(key, table->capacity);
    while (table->entries[index].key != NULL) {
        if (strcmp(table->entries[index].key, key) == 0) {
            table->entries[index].value = value;
            return 1;
        }

        index = (index + 1) % table->capacity;
    }

    table->entries[index].key = strdup(key);
    if (table->entries[index].key == NULL) {
        return 0;
    }

    table->entries[index].value = value;
    table->count += 1;
    return 1;
}

int ht_get(const HashTable *table, const char *key, int *out_value) {
    if (table == NULL || key == NULL || out_value == NULL || table->entries == NULL) {
        return 0;
    }

    size_t index = hash_key(key, table->capacity);
    while (table->entries[index].key != NULL) {
        if (strcmp(table->entries[index].key, key) == 0) {
            *out_value = table->entries[index].value;
            return 1;
        }
        index = (index + 1) % table->capacity;
    }

    return 0;
}

int ht_contains(const HashTable *table, const char *key) {
    int value = 0;
    return ht_get(table, key, &value);
}

int ht_remove(HashTable *table, const char *key) {
    if (table == NULL || key == NULL || table->entries == NULL) {
        return 0;
    }

    size_t index = hash_key(key, table->capacity);
    while (table->entries[index].key != NULL) {
        if (strcmp(table->entries[index].key, key) == 0) {
            free(table->entries[index].key);
            table->entries[index].key = NULL;
            table->entries[index].value = 0;
            table->count -= 1;
            return 1;
        }
        index = (index + 1) % table->capacity;
    }

    return 0;
}

size_t ht_size(const HashTable *table) {
    if (table == NULL) {
        return 0;
    }
    return table->count;
}
