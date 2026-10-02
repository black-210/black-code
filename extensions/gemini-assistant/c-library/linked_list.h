#ifndef LINKED_LIST_H
#define LINKED_LIST_H

#include <stddef.h>

typedef struct Node {
    int value;
    struct Node *next;
} Node;

Node *ll_create(int value);
void ll_push_front(Node **head, int value);
void ll_push_back(Node **head, int value);
int ll_contains(const Node *head, int value);
void ll_remove(Node **head, int value);
size_t ll_size(const Node *head);
void ll_free(Node **head);

#endif
