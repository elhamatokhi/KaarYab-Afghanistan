"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState, useTransition } from "react";
import {
  DEADLINE_STATUSES,
  EMPLOYMENT_TYPES,
  OPPORTUNITY_CATEGORIES,
  OPPORTUNITY_SORT_OPTIONS,
  WORK_MODES,
} from "@/features/opportunities/constants";
import type { OpportunitySearchParams } from "@/features/opportunities/types";
import { DEFAULT_OPPORTUNITY_SORT } from "@/features/opportunities/utils";

type OpportunityFilterControlsProps = {
  params: OpportunitySearchParams;
};

export function OpportunityFilterControls({
  params,
}: OpportunityFilterControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { filters, sort } = params;
  const [searchValue, setSearchValue] = useState(filters.query);
  const lastUrlSearch = useRef(filters.query);

  useEffect(() => {
    const previousUrlSearch = lastUrlSearch.current;

    lastUrlSearch.current = filters.query;
    setSearchValue((currentSearchValue) =>
      currentSearchValue === previousUrlSearch ? filters.query : currentSearchValue,
    );
  }, [filters.query]);

  useEffect(() => {
    const currentUrlSearch = searchParams.get("search")?.trim() ?? "";
    const nextSearch = searchValue.trim();

    if (nextSearch === currentUrlSearch) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextParams = new URLSearchParams(searchParams.toString());

      setOptionalParam(nextParams, "search", nextSearch);

      startTransition(() => {
        router.replace(createHref(pathname, nextParams), { scroll: false });
      });
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname, router, searchParams, searchValue]);

  function replaceParam(name: string, value: string) {
    const nextParams = new URLSearchParams(searchParams.toString());

    if (!value || value === "all" || (name === "sort" && value === DEFAULT_OPPORTUNITY_SORT)) {
      nextParams.delete(name);
    } else {
      nextParams.set(name, value);
    }

    startTransition(() => {
      router.replace(createHref(pathname, nextParams), { scroll: false });
    });
  }

  function submitTextFields(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextParams = new URLSearchParams(searchParams.toString());
    const search = getFormValue(formData, "search");
    const location = getFormValue(formData, "location");

    setOptionalParam(nextParams, "search", search);
    setOptionalParam(nextParams, "location", location);

    startTransition(() => {
      router.replace(createHref(pathname, nextParams), { scroll: false });
    });
  }

  return (
    <form onSubmit={submitTextFields} className="mt-5 space-y-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <TextField
          id="opportunity-search"
          label="Search title or organization"
          name="search"
          placeholder="Try scholarship, CodeBridge, data"
          value={searchValue}
          onChange={setSearchValue}
          disabled={false}
        />
        <TextField
          id="opportunity-location"
          label="Country or location"
          name="location"
          placeholder="Try Afghanistan, Online, Herat"
          defaultValue={filters.countryOrLocation}
          disabled={isPending}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <SelectField
          id="opportunity-category"
          label="Category"
          name="category"
          value={filters.category}
          options={OPPORTUNITY_CATEGORIES}
          disabled={isPending}
          onChange={replaceParam}
        />
        <SelectField
          id="opportunity-work-mode"
          label="Work mode"
          name="workMode"
          value={filters.workMode}
          options={WORK_MODES}
          disabled={isPending}
          onChange={replaceParam}
        />
        <SelectField
          id="opportunity-employment-type"
          label="Type"
          name="employmentType"
          value={filters.employmentType}
          options={EMPLOYMENT_TYPES}
          disabled={isPending}
          onChange={replaceParam}
        />
        <SelectField
          id="opportunity-deadline-status"
          label="Deadline"
          name="deadlineStatus"
          value={filters.deadlineStatus}
          options={DEADLINE_STATUSES}
          disabled={isPending}
          onChange={replaceParam}
        />
        <SelectField
          id="opportunity-sort"
          label="Sort by"
          name="sort"
          value={sort}
          options={OPPORTUNITY_SORT_OPTIONS}
          includeAllOption={false}
          disabled={isPending}
          onChange={replaceParam}
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">
          Search matches opportunity title and organization.
        </p>
        <p aria-live="polite" className="min-h-5 text-xs leading-5 text-muted">
          {isPending ? "Updating results..." : ""}
        </p>
      </div>
    </form>
  );
}

function TextField({
  defaultValue,
  disabled,
  id,
  label,
  name,
  onChange,
  placeholder,
  value,
}: {
  defaultValue?: string;
  disabled: boolean;
  id: string;
  label: string;
  name: string;
  onChange?: (value: string) => void;
  placeholder: string;
  value?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="search"
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        placeholder={placeholder}
        className="mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-60"
      />
    </div>
  );
}

function SelectField<TOption extends string>({
  disabled,
  id,
  includeAllOption = true,
  label,
  name,
  onChange,
  options,
  value,
}: {
  disabled: boolean;
  id: string;
  includeAllOption?: boolean;
  label: string;
  name: string;
  onChange: (name: string, value: string) => void;
  options: readonly { value: TOption; label: string }[];
  value: TOption | "all";
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-primary">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(name, event.currentTarget.value)}
        className="mt-2 min-h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        {includeAllOption ? <option value="all">All</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function getFormValue(formData: FormData, name: string) {
  const value = formData.get(name);

  return typeof value === "string" ? value.trim() : "";
}

function setOptionalParam(
  searchParams: URLSearchParams,
  name: string,
  value: string,
) {
  if (value) {
    searchParams.set(name, value);
  } else {
    searchParams.delete(name);
  }
}

function createHref(pathname: string, searchParams: URLSearchParams) {
  const queryString = searchParams.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}
