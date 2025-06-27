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
            >
                <div className="px-2 py-1">
                    {React.Children.toArray(children)}
                </div>
            </div>
        );
    }
);

const CustomDropdownItem = ({ children, onClick, ...props }: any) => {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) onClick(e);
    };

    return (
        <div {...props} onClick={handleClick}>
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
        overflowY:
            items.length > 4
                ? 'auto'
                : ('hidden' as React.CSSProperties['overflowY']),
    };

    const handleSelect = (item: SelectItem, e: React.MouseEvent) => {
        e.stopPropagation();
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
        <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
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
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                {items.map((item) => (
                    <Dropdown.Item
                        key={item.id}
                        as={CustomDropdownItem}
                        className="px-3 py-2"
                        style={{ height: '40px' }}
                        onClick={(e: React.MouseEvent) => handleSelect(item, e)}
                    >
                        <Form.Check
                            type="checkbox"
                            id={`multi-select-${item.id}`}
                            label={item.label}
                            checked={selectedItems.some(
                                (selected) => selected.id === item.id
                            )}
                            onChange={() => {}}
                        />
                    </Dropdown.Item>
                ))}
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default MultiSelect;
