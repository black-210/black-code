#include "binary_tree.h"

#include <stdlib.h>

TreeNode *bt_create(int value) {
    TreeNode *node = (TreeNode *)malloc(sizeof(TreeNode));
    if (node == NULL) {
        return NULL;
    }

    node->value = value;
    node->left = NULL;
    node->right = NULL;
    return node;
}

void bt_insert(TreeNode **root, int value) {
    if (root == NULL) {
        return;
    }

    if (*root == NULL) {
        *root = bt_create(value);
        return;
    }

    if (value < (*root)->value) {
        bt_insert(&(*root)->left, value);
    } else if (value > (*root)->value) {
        bt_insert(&(*root)->right, value);
    }
}

int bt_contains(const TreeNode *root, int value) {
    if (root == NULL) {
        return 0;
    }

    if (root->value == value) {
        return 1;
    }

    if (value < root->value) {
        return bt_contains(root->left, value);
    }

    return bt_contains(root->right, value);
}

void bt_destroy(TreeNode **root) {
    if (root == NULL || *root == NULL) {
        return;
    }

    bt_destroy(&(*root)->left);
    bt_destroy(&(*root)->right);
    free(*root);
    *root = NULL;
}

int bt_height(const TreeNode *root) {
    if (root == NULL) {
        return 0;
    }

    int left_height = bt_height(root->left);
    int right_height = bt_height(root->right);
    return 1 + (left_height > right_height ? left_height : right_height);
}
