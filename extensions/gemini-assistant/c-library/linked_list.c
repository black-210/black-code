#include "linked_list.h"

#include <stdlib.h>

Node *ll_create(int value) {
    Node *node = (Node *)malloc(sizeof(Node));
    if (node == NULL) {
        return NULL;
    }

    node->value = value;
    node->next = NULL;
    return node;
}

void ll_push_front(Node **head, int value) {
    if (head == NULL) {
        return;
    }

    Node *node = ll_create(value);
    if (node == NULL) {
        return;
    }

    node->next = *head;
    *head = node;
}

void ll_push_back(Node **head, int value) {
    if (head == NULL) {
        return;
    }

    Node *node = ll_create(value);
    if (node == NULL) {
        return;
    }

    if (*head == NULL) {
        *head = node;
        return;
    }

    Node *current = *head;
    while (current->next != NULL) {
        current = current->next;
    }

    current->next = node;
}

int ll_contains(const Node *head, int value) {
    for (const Node *current = head; current != NULL; current = current->next) {
        if (current->value == value) {
            return 1;
        }
    }
    return 0;
}

void ll_remove(Node **head, int value) {
    if (head == NULL || *head == NULL) {
        return;
    }

    Node *current = *head;
    Node *previous = NULL;

    while (current != NULL) {
        if (current->value == value) {
            if (previous == NULL) {
                *head = current->next;
            } else {
                previous->next = current->next;
            }

            free(current);
            return;
        }

        previous = current;
        current = current->next;
    }
}

size_t ll_size(const Node *head) {
    size_t size = 0;
    for (const Node *current = head; current != NULL; current = current->next) {
        size += 1;
    }
    return size;
}

void ll_free(Node **head) {
    if (head == NULL) {
        return;
    }

    while (*head != NULL) {
        Node *next = (*head)->next;
        free(*head);
        *head = next;
    }
}
