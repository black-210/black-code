#ifndef HASH_TABLE_H
#define HASH_TABLE_H

#include <stddef.h>

typedef struct {
    char *key;
    int value;
} HashEntry;

typedef struct {
    HashEntry *entries;
    size_t capacity;
    size_t count;
} HashTable;

void ht_init(HashTable *table, size_t capacity);
void ht_free(HashTable *table);
int ht_set(HashTable *table, const char *key, int value);
int ht_get(const HashTable *table, const char *key, int *out_value);
int ht_contains(const HashTable *table, const char *key);
int ht_remove(HashTable *table, const char *key);
size_t ht_size(const HashTable *table);

#endif
