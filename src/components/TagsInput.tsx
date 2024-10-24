import React from "react";

type TagsInputProps = {
  tags: string[];
  allTags: string[];
  onAddTag: (tag: string) => void;
  onDeleteTag: (tag: string) => void;
};

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  allTags,
  onAddTag,
  onDeleteTag,
}) => {
  return (
    <div className='flex flex-wrap'>
      <input
        list='tags'
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.currentTarget.value) {
            onAddTag(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
        className='border mt-2 p-2 mb-2 w-full rounded'
      />
      <datalist id='tags'>
        {allTags.map((tag) => (
          <option
            key={tag}
            value={tag}
          />
        ))}
      </datalist>

      <ul className='flex flex-wrap'>
        {tags.map((tag) => (
          <li
            key={tag}
            className='flex items-center bg-blue-200 px-2 py-1 mr-2 rounded'>
            {tag}{" "}
            <button
              onClick={() => onDeleteTag(tag)}
              className='ml-2 text-red-500'>
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagsInput;
