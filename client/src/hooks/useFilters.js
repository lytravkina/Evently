import { useState, useEffect } from "react";

export function useFilters(currentEvents) {
    const [search, setSearch] = useState(
        () => JSON.parse(localStorage.getItem("FILTERS_KEY"))?.search ?? "",
    );
    const [category, setCategory] = useState(
        () => JSON.parse(localStorage.getItem("FILTERS_KEY"))?.category ?? "",
    );

    const [sortingType, setSortingType] = useState(
        () => JSON.parse(localStorage.getItem("FILTERS_KEY"))?.sorting ?? null,
    );

    const categories = currentEvents.reduce((categories, event) => {
        if (!categories.includes(event.category)) {
            categories.push(event.category);
        }
        return categories;
    }, []);

    const matchesSearch = currentEvents.filter((event) => {
        return (
            event.title.toLowerCase().includes(search.trim().toLowerCase()) ||
            event.description.toLowerCase().includes(search.trim().toLowerCase())
        );
    });

    const matchesFilters = matchesSearch.filter((event) => {
        return category ? event.category === category : event;
    });

    const sortedEvents = (type) => {
        const arr = [...matchesFilters];
        switch (type) {
            case "title-asc":
                return arr.sort((a, b) => a.title.localeCompare(b.title));
            case "title-desc":
                return arr.sort((a, b) => b.title.localeCompare(a.title));
            case "date-asc":
                return arr.sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
                );
            case "date-desc":
                return arr.sort(
                    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
                );
            case "capacity-asc":
                return arr.sort((a, b) => a.capacity - b.capacity);
            case "capacity-desc":
                return arr.sort((a, b) => b.capacity - a.capacity);
            default:
                return arr;
        }
    };

    useEffect(() => {
        localStorage.setItem(
            "FILTERS_KEY",
            JSON.stringify({ search, category, sorting: sortingType }),
        );
    }, [search, category, sortingType]);

    return { search, category, sortingType, setSearch, setCategory, setSortingType, categories, sortedEvents }
}