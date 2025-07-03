import React from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import { MultiSelectProps, SelectItem } from '../types/ExperimentInfoTypes';

const CustomDropdownMenu = React.forwardRef(
    (
        { children, style, className, 'aria-labelledby': labeledBy }: any,
        ref
    ) => {
        return (
            <div
                ref={ref as any}
                style={{
                    ...style,
                    maxHeight: '200px',
                    overflowY: 'auto',
                }}
                className={className}
                aria-labelledby={labeledBy}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-2 py-1">
                    {React.Children.map(children, (child, index) =>
                        React.cloneElement(child, {
                            key: child.key || `dropdown-item-${index}`,
                        })
                    )}
                </div>
            </div>
        );
    }
);


const CustomDropdownItem = ({
    children,
    isSelected,
    onClick,
    ...props
}: any) => {
    return (
        <div
            {...props}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className={`d-flex align-items-center px-3 py-2 ${
                isSelected ? 'bg-light' : ''
            }`}
            style={{
                cursor: 'pointer',
                height: '40px',
                width: '100%',
                userSelect: 'none',
                transition: 'background-color 0.2s',
            }}
        >
            {children}
        </div>
    );
};

const MultiSelect: React.FC<MultiSelectProps> = ({
    items,
    selectedItems,
    onSelectionChange,
    loading = false,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const menuStyle: React.CSSProperties = {
        maxHeight: `${Math.min(items.length, 4) * 40}px`,
        overflowY: items.length > 4 ? 'auto' : 'hidden',
    };

    const handleSelect = (item: SelectItem) => {
        const isSelected = selectedItems.some(
            (selected) => selected.id === item.id
        );
        if (isSelected) {
            onSelectionChange(
                selectedItems.filter((selected) => selected.id !== item.id)
            );
        } else {
            onSelectionChange([...selectedItems, item]);
        }
    };

    if (loading) {
        return <div className="text-center my-3">Загрузка данных...</div>;
    }

    return (
        <Dropdown
            show={isOpen}
            onToggle={(isOpen) => setIsOpen(isOpen)}
            autoClose="outside" // Добавлено это
        >
            <Dropdown.Toggle
                variant="outline-secondary"
                className="w-100"
                title={
                    selectedItems.length > 0
                        ? selectedItems.map((item) => item.label).join(', ')
                        : ''
                }
            >
                {selectedItems.length > 0
                    ? `Выбрано: ${selectedItems.length}`
                    : 'Выберите операторов'}
            </Dropdown.Toggle>

            <Dropdown.Menu
                as={CustomDropdownMenu}
                style={menuStyle}
                className="w-100 p-0"
            >
                {items.map((item) => {
                    const isSelected = selectedItems.some(
                        (selected) => selected.id === item.id
                    );
                    return (
                        <Dropdown.Item
                            key={`${item.id} - ${item.label}`}
                            as={CustomDropdownItem}
                            isSelected={isSelected}
                            onClick={(e: React.MouseEvent) => {
                                handleSelect(item);
                            }}
                        >
                            <Form.Check
                                type="checkbox"
                                id={`multi-select-${item.id}-${Date.now()}`}
                                label={item.label}
                                checked={isSelected}
                                onChange={() => {}}
                                onClick={(e: React.MouseEvent) => {
                                    e.stopPropagation();
                                    handleSelect(item);
                                }}
                            />
                        </Dropdown.Item>
                    );
                })}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default MultiSelect;
