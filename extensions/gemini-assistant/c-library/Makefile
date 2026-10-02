CC = gcc
CFLAGS = -std=c11 -Wall -Wextra -O2 -I.
TARGET = advanced_c_demo

SOURCES = advanced_c_demo.c dynamic_array.c linked_list.c hash_table.c binary_tree.c string_utils.c
OBJECTS = $(SOURCES:.c=.o)

all: $(TARGET)

$(TARGET): $(OBJECTS)
	$(CC) $(CFLAGS) -o $@ $(OBJECTS)

%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f $(OBJECTS) $(TARGET)
