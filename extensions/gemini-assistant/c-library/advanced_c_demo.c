#include <stdio.h>
#include <stdlib.h>

#include "binary_tree.h"
#include "dynamic_array.h"
#include "hash_table.h"
#include "linked_list.h"
#include "string_utils.h"

int main(void) {
    printf("Gemini Advanced C Toolkit Demo\n");
    printf("================================\n");

    DynamicArray ints;
    da_init(&ints, sizeof(int), 4);

    int a = 10;
    int b = 20;
    int c = 30;
    da_push_back(&ints, &a);
    da_push_back(&ints, &b);
    da_push_back(&ints, &c);

    printf("Dynamic array size: %zu\n", ints.length);
    printf("Third value: %d\n", *(int *)da_at(&ints, 2));

    Node *head = NULL;
    ll_push_back(&head, 5);
    ll_push_back(&head, 10);
    ll_push_back(&head, 15);
    printf("Linked list size: %zu\n", ll_size(head));
    printf("Contains 10: %s\n", ll_contains(head, 10) ? "yes" : "no");
    ll_free(&head);

    HashTable table;
    ht_init(&table, 8);
    ht_set(&table, "alpha", 42);
    ht_set(&table, "beta", 99);

    int value = 0;
    if (ht_get(&table, "alpha", &value)) {
        printf("Hash alpha = %d\n", value);
    }

    TreeNode *root = NULL;
    bt_insert(&root, 50);
    bt_insert(&root, 25);
    bt_insert(&root, 75);
    bt_insert(&root, 10);
    printf("Binary tree height: %d\n", bt_height(root));
    printf("Contains 25: %s\n", bt_contains(root, 25) ? "yes" : "no");
    bt_destroy(&root);

    char *name = su_join("Gemini", " C");
    char *upper = su_to_upper(name);
    printf("String: %s\n", upper);
    free(name);
    free(upper);

    ht_free(&table);
    da_free(&ints);
    return 0;
}
