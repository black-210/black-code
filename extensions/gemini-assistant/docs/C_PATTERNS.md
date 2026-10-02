# Gemini C Code Generator Patterns
# Focus on C language best practices and common patterns

## Main & Entry Points

### Simple Main
```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    printf("Hello, World!\n");
    return EXIT_SUCCESS;
}
```

### Main with Arguments
```c
int main(int argc, char *argv[]) {
    for (int i = 0; i < argc; i++) {
        printf("argv[%d] = %s\n", i, argv[i]);
    }
    return EXIT_SUCCESS;
}
```

## Memory Management

### Safe malloc/free Pattern
```c
int *arr = (int *)malloc(sizeof(int) * n);
if (arr == NULL) {
    fprintf(stderr, "malloc failed\n");
    return EXIT_FAILURE;
}
// Use arr
free(arr);
arr = NULL;
```

### Struct with Dynamic Memory
```c
typedef struct {
    int *data;
    size_t size;
} DynamicArray;

DynamicArray *array_create(size_t size) {
    DynamicArray *arr = (DynamicArray *)malloc(sizeof(DynamicArray));
    if (!arr) return NULL;
    
    arr->data = (int *)malloc(sizeof(int) * size);
    if (!arr->data) {
        free(arr);
        return NULL;
    }
    arr->size = size;
    return arr;
}

void array_destroy(DynamicArray *arr) {
    if (arr) {
        free(arr->data);
        free(arr);
    }
}
```

## String Handling

### Safe String Copy
```c
char dest[64];
strncpy(dest, src, sizeof(dest) - 1);
dest[sizeof(dest) - 1] = '\0';
```

### String Concatenation
```c
char buffer[256];
snprintf(buffer, sizeof(buffer), "%s:%d", name, value);
```

## File I/O

### Read File Line by Line
```c
FILE *fp = fopen("input.txt", "r");
if (!fp) {
    perror("fopen");
    return EXIT_FAILURE;
}

char line[256];
while (fgets(line, sizeof(line), fp)) {
    printf("%s", line);
}
fclose(fp);
```

### Write File
```c
FILE *fp = fopen("output.txt", "w");
if (!fp) {
    perror("fopen");
    return EXIT_FAILURE;
}

fprintf(fp, "Data: %d\n", value);
fclose(fp);
```

## Arrays & Loops

### Static Array Iteration
```c
int arr[10] = {1, 2, 3, 4, 5};
for (int i = 0; i < 10; i++) {
    printf("%d ", arr[i]);
}
printf("\n");
```

### Dynamic Array Iteration
```c
int *arr = (int *)malloc(sizeof(int) * n);
for (size_t i = 0; i < n; i++) {
    arr[i] = i * 2;
}
free(arr);
```

## Pointers & References

### Pointer Basics
```c
int value = 42;
int *ptr = &value;

printf("Value: %d\n", *ptr);
printf("Address: %p\n", (void *)ptr);

*ptr = 100;
printf("Updated: %d\n", value);
```

### Pointer to Array
```c
int arr[5] = {10, 20, 30, 40, 50};
int *ptr = arr;  // Point to first element

for (int i = 0; i < 5; i++) {
    printf("%d ", *(ptr + i));
}
```

## Structs & Typedefs

### Simple Struct
```c
struct Point {
    int x;
    int y;
};

struct Point p = {10, 20};
printf("Point: (%d, %d)\n", p.x, p.y);
```

### Typedef Struct
```c
typedef struct {
    char name[64];
    int age;
    double height;
} Person;

Person person = {"John", 30, 5.9};
```

## Functions

### Function Declaration & Definition
```c
int add(int a, int b) {
    return a + b;
}

int result = add(5, 3);
```

### Function with Pointer Parameter
```c
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int x = 5, y = 10;
swap(&x, &y);
```

## Error Handling

### Return Status Pattern
```c
int process_file(const char *filename) {
    FILE *fp = fopen(filename, "r");
    if (!fp) {
        fprintf(stderr, "Cannot open file: %s\n", filename);
        return -1;
    }
    // Process file
    fclose(fp);
    return 0;
}
```

## Common Pitfalls to Avoid

❌ **Don't**: `strcpy(dest, src)` - Use `strncpy()` instead
❌ **Don't**: `gets(buffer)` - Use `fgets()` instead
❌ **Don't**: `malloc()` without checking NULL
❌ **Don't**: Mix allocated and stack memory without care
❌ **Don't**: Forget to `free()` allocated memory

✅ **Do**: Use `strncpy()`, `snprintf()`, `fgets()`
✅ **Do**: Check malloc() return value
✅ **Do**: Free in reverse order of allocation
✅ **Do**: Set pointers to NULL after free
